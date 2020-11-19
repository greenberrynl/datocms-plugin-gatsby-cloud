import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
  plugin,
}))
export default class Main extends Component {
  static propTypes = {
    plugin: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      localePrefix: '',
      slug: '',
      slugField: '',
      frontendPath: '',
      frontendPathField: '',
    };
    this.slugChange = this.slugChange.bind(this);
    this.frontendPathChange = this.frontendPathChange.bind(this);
  }

  componentDidMount() {
    const { plugin } = this.props;

    const {
      itemType,
      fields,
      locale,
      field,
      parameters: {
        global: { developmentMode, useLocalePath, skipDefaultLocalePath },
      },
    } = plugin;

    if (useLocalePath && !(skipDefaultLocalePath && plugin.site.attributes.locales[0] === locale)) {
      this.setState({ localePrefix: locale });
    }

    const slugField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => (f.attributes.field_type === 'slug' || f.attributes.api_key === 'slug'));

    const frontendPathField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => f.attributes.api_key === 'frontend_path');

    if (frontendPathField && frontendPathField.attributes.localized) {
      const frontendPathLocation = frontendPathField.attributes.localized
        ? `${frontendPathField.attributes.api_key}.${locale}`
        : frontendPathField.attributes.api_key;

      if (frontendPathLocation) {
        this.setState({
          frontendPath: plugin.getFieldValue(frontendPathLocation),
        });
        this.unsubscribePathChange = plugin.addFieldChangeListener(frontendPathLocation, this.frontendPathChange); //eslint-disable-line
      }
    }

    if (frontendPathField
      && slugField
      && (slugField.attributes.localized && !frontendPathField.attributes.localized)) {
      console.error(`Since the "${slugField.attributes.api_key}" slug field is localized, 
      so needs to be the "${frontendPathField.attributes.api_key}" field!`);

      return;
    }

    if (slugField && slugField.attributes.localized && !field.attributes.localized) {
      if (developmentMode) {
        console.error(`Since the "${slugField.attributes.api_key}" slug field is localized, so needs to be the "${field.attributes.api_key}" field!`);
      }

      return;
    }

    if (slugField) {
      const fieldPath = slugField.attributes.localized
        ? `${slugField.attributes.api_key}.${locale}`
        : slugField.attributes.api_key;

      if (fieldPath) {
        this.setState({ slug: plugin.getFieldValue(fieldPath) });
        this.unsubscribeSlugChange = plugin.addFieldChangeListener(fieldPath, this.slugChange);
      }
    }

    this.setState({
      slugField,
      frontendPathField,
    });
  }

  componentWillUnmount() {
    const { slugField, frontendPathField } = this.state;
    if (slugField) {
      this.unsubscribeSlugChange();
    }

    if (frontendPathField) {
      this.unsubscribePathChange();
    }
  }

  generatePath(totalPath, part) {
    return part ? `${totalPath}/${part}` : `${totalPath}`;
  }

  slugChange(newValue) {
    this.setState({
      slug: newValue,
    });
  }

  frontendPathChange(newValue) {
    this.setState({
      frontendPath: newValue,
    });
  }

  render() {
    const { plugin } = this.props;
    const {
      parameters: {
        global: { instanceUrl, authToken },
      },
    } = plugin;

    const {
      localePrefix,
      frontendPath,
      slug,
    } = this.state;
    const previewPath = [localePrefix, frontendPath, slug].reduce(this.generatePath, '');

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        <ExtensionUI
          contentSlug={previewPath}
          previewUrl={instanceUrl}
          authToken={authToken}
        />
      </div>
    );
  }
}
