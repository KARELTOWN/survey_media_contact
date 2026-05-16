import mongoose from "../../config/mongodb.js";
import validator from 'validator'

const SurveyThemeSchema = new mongoose.Schema({
  header_bg_color: {
    type: String,
    required: false,
    validate: {
        validator: function(value)
        {
            if(value && !validator.isHexColor(value)){
                return false
            }
        }
    }
  },
  container_bg_color: {
    type: String,
    required: false,
    validate: {
        validator: function(value)
        {
            if(value && !validator.isHexColor(value)){
                return false
            }
        }
    }
  },
  header_text_color: {
    type: String,
    required: false,
    default: '#000000',
    validate: {
        validator: function(value)
        {
            if(value && !validator.isHexColor(value)){
                return false
            }
        }
    }
  },
  container_bg_img: {
    type: String,
    required: false,
  },
  logo_url: {
    type: String,
    required: false,
  },
  banner_url: {
    type: String,
    required: false,
  },
  footer_text: {
    type: String,
    required: false,
  },
  show_footer_contact: {
    type: Boolean,
    default: false,
  },
  footer_contact_name: {
    type: String,
    required: false,
  },
  footer_contact_email: {
    type: String,
    required: false,
  },
  footer_contact_phone: {
    type: String,
    required: false,
  },
  footer_contact_address: {
    type: String,
    required: false,
  },
  footer_contact_hours: {
    type: String,
    required: false,
  },
  footer_links: [{
    label: { type: String, required: false },
    url: { type: String, required: false },
  }],
  form_width: {
    type: String,
    enum: ["narrow", "medium", "wide", "full"],
    default: "medium",
  },
  form_alignment: {
    type: String,
    enum: ["left", "center"],
    default: "center",
  },
  form_spacing: {
    type: String,
    enum: ["compact", "normal", "comfortable"],
    default: "normal",
  },
  global_bg_color: {
    type: String,
    required: false,
    validate: {
        validator: function(value)
        {
            if(value && !validator.isHexColor(value)){
                return false
            }
        }
    }
  },
}, {_id: false});

export default SurveyThemeSchema;
