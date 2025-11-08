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
}, {_id: false});

export default SurveyThemeSchema;
