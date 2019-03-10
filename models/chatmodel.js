const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileUpload = new Schema({
    title : String,
    filename : String,
    description : String
});

const Upload = mongoose.model('Upload', FileUpload);

module.exports = Upload;