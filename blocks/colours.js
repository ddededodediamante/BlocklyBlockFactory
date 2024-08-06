function randomColor() {
    const r = Math.floor(Math.random() * 206) + 50;
    const g = Math.floor(Math.random() * 206) + 50;
    const b = Math.floor(Math.random() * 206) + 50;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

Blockly.Blocks['colour_picker'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('colour')
            .appendField(new FieldColour(randomColor()), 'colour');
        this.setOutput(true, 'Colour');
        this.setColour(20);
    }
};

javascript.javascriptGenerator.forBlock['colour_picker'] = function (block, generator) {
    var colour = block.getFieldValue('colour');
    return [colour, javascript.Order.ATOMIC];
};

Blockly.Blocks['colour_picker_hsv'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('hsv')
            .appendField(new FieldColourHsvSliders(randomColor()), 'hsv');
        this.setOutput(true, 'Colour');
        this.setColour(20);
    }
};

javascript.javascriptGenerator.forBlock['colour_picker_hsv'] = function (block, generator) {
    var colour = block.getFieldValue('hsv');
    return [colour, javascript.Order.ATOMIC];
};

Blockly.Blocks['colour_custom'] = {
    init: function () {
        var validator = function (newValue) {
            let regExp = /^#([0-9a-fA-F]{3}){1,2}$/i;
            if (regExp.test(newValue)) {
                return newValue;
            } else {
                return null;
            }
        };

        var field = new Blockly.FieldTextInput(randomColor());
        field.setValidator(validator);

        this.appendDummyInput()
            .appendField('custom hex')
            .appendField(field, 'colour');
        this.setColour(20);
        this.setOutput(true, 'Colour');
    }
};

javascript.javascriptGenerator.forBlock['colour_custom'] = function (block, generator) {
    var colour = block.getFieldValue('colour');
    return [colour, javascript.Order.ATOMIC];
};