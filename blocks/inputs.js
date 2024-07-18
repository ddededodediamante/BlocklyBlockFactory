Blockly.Blocks['input_value'] = {
    init: function () {
        this.appendDummyInput('name')
            .appendField('value input named')
            .appendField(new Blockly.FieldTextInput('name'), 'name');
        this.appendStatementInput('code')
            .setCheck('Field')
            .appendField('with fields');
        this.appendDummyInput()
            .appendField('set fields position to')
            .appendField(new Blockly.FieldDropdown([
                ['left', '-1'],
                ['centre', '0'],
                ['right', '1']
            ]), 'fieldsPos');
        this.appendValueInput('check')
            .setCheck('OutputType')
            .appendField('set check to');
        this.setPreviousStatement(true, "Input");
        this.setNextStatement(true, "Input");
        this.setInputsInline(false);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour('#5b80a5');
    }
};

javascript.javascriptGenerator.forBlock['input_value'] = function (block, generator) {
    var name = block.getFieldValue('name');
    name = name.replace(/[^A-Za-z0-9_.-]/g, '_');
    var statement_code = generator.statementToCode(block, 'code');
    var fieldPos = block.getFieldValue('fieldsPos');
    var check = generator.valueToCode(block, 'check', javascript.Order.ATOMIC) || null;

    var code = `this.appendValueInput('${name}')\n.setCheck(${check})${fieldPos != -1 ? `\n.setAlign(${fieldPos})` : ''}${statement_code};\n`;
    return code;
}

Blockly.Blocks['input_statement'] = {
    init: function () {
        this.appendDummyInput('name')
            .appendField('statement input named')
            .appendField(new Blockly.FieldTextInput('name'), 'name');
        this.appendStatementInput('code')
            .setCheck('Field')
            .appendField('with fields');
        this.appendDummyInput()
            .appendField('set fields position to')
            .appendField(new Blockly.FieldDropdown([
                ['left', '-1'],
                ['centre', '0'],
                ['right', '1']
            ]), 'fieldsPos');
        this.appendValueInput('check')
            .setCheck('OutputType')
            .appendField('set check to');
        this.setPreviousStatement(true, "Input");
        this.setNextStatement(true, "Input");
        this.setInputsInline(false);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour('#5b80a5');
    }
};

javascript.javascriptGenerator.forBlock['input_statement'] = function (block, generator) {
    var name = block.getFieldValue('name');
    name = name.replace(/[^A-Za-z0-9_.-]/g, '_');
    var statement_code = generator.statementToCode(block, 'code');
    var fieldPos = block.getFieldValue('fieldsPos');
    var check = generator.valueToCode(block, 'check', javascript.Order.ATOMIC) || null;

    var code = `this.appendStatementInput('${name}')\n.setCheck(${check})${fieldPos != -1 ? `\n.setAlign(${fieldPos})` : ''}${statement_code};\n`;
    return code;
}

Blockly.Blocks['input_dummy'] = {
    init: function () {
        this.appendDummyInput('name')
            .appendField('dummy input named')
            .appendField(new Blockly.FieldTextInput('name'), 'name');
        this.appendStatementInput('code')
            .setCheck('Field')
            .appendField('with fields');
        this.appendDummyInput()
            .appendField('set fields position to')
            .appendField(new Blockly.FieldDropdown([
                ['left', '-1'],
                ['centre', '0'],
                ['right', '1']
            ]), 'fieldsPos');
        this.setPreviousStatement(true, "Input");
        this.setNextStatement(true, "Input");
        this.setInputsInline(false);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour('#5b80a5');
    }
};

javascript.javascriptGenerator.forBlock['input_dummy'] = function (block, generator) {
    var name = block.getFieldValue('name');
    name = name.replace(/[^A-Za-z0-9_.-]/g, '_');
    var statement_code = generator.statementToCode(block, 'code');
    var fieldPos = block.getFieldValue('fieldsPos');

    var code = `this.appendDummyInput('${name}')\n${fieldPos != -1 ? `\n.setAlign(${fieldPos})` : ''}${statement_code};\n`;
    return code;
}

Blockly.Blocks['input_endrow'] = {
    init: function () {
        this.appendDummyInput('name')
            .appendField('end-row input named')
            .appendField(new Blockly.FieldTextInput('name'), 'name');
        this.appendStatementInput('code')
            .setCheck('Field')
            .appendField('with fields');
        this.appendDummyInput()
            .appendField('set fields position to')
            .appendField(new Blockly.FieldDropdown([
                ['left', '-1'],
                ['centre', '0'],
                ['right', '1']
            ]), 'fieldsPos');
        this.setPreviousStatement(true, "Input");
        this.setNextStatement(true, "Input");
        this.setInputsInline(false);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour('#5b80a5');
    }
};

javascript.javascriptGenerator.forBlock['input_endrow'] = function (block, generator) {
    var name = block.getFieldValue('name');
    name = name.replace(/[^A-Za-z0-9_.-]/g, '_');
    var statement_code = generator.statementToCode(block, 'code');
    var fieldPos = block.getFieldValue('fieldsPos');

    var code = `this.appendEndRowInput('${name}')\n${fieldPos != -1 ? `\n.setAlign(${fieldPos})` : ''}${statement_code};\n`;
    return code;
}