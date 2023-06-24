"use strict";
class SerialData {
    constructor(sentence = "") {
        this.sentence = sentence;
        this.fields = [];
        this.sentenceId = "";

        if (!this.sentence.startsWith("$")) {
            this.fields = [""];
            this.sentenceId = "";
        }
        else {
            if (this.sentence.startsWith("$PUB")) {
                this.fields = this.sentence.substring(2, this.sentence.length - 2).split(",");
            }
            else {
                this.fields = this.sentence.substring(3, this.sentence.length - 3).split(",");
            }
            this.sentenceId = this.fields[0];
        }
    }
    isValid = function () {
        return this.sentenceId.length > 1;
    };
}
exports.SerialData = SerialData;
