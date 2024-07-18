Blockly.Blocks['type_dropdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['any', 'null'],
                ['String', 'String'],
                ['Number', 'Number'],
                ['Boolean', 'Boolean'],
                ['Array', 'Array']
            ]), 'DROPDOWN');
        this.setOutput(true, 'OutputType');
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour("#5ba55b");
    }
};

javascript.javascriptGenerator.forBlock['type_dropdown'] = function (block, generator) {
    var dropdown = block.getFieldValue('DROPDOWN');
    if (dropdown == 'null') {
        return ['null', javascript.Order.ATOMIC];
    } else {
        return [`'${dropdown}'`, javascript.Order.ATOMIC];
    }
}

Blockly.Blocks['type_custom'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('type')
            .appendField(new Blockly.FieldTextInput('custom'), 'type');
        this.setColour("#5ba55b");
        this.setTooltip('');
        this.setHelpUrl('');
        this.setOutput(true, 'OutputType');
    }
};

javascript.javascriptGenerator.forBlock['type_custom'] = function (block, generator) {
    var field_type = block.getFieldValue('type');
    var code = `'${field_type}'`;
    return [code, javascript.Order.ATOMIC];
};