window.mainBlockName = 'block_id_here';
window.mainBlockType = 'block';
window.jsCodeGenerator = 'console.log("h")';

var mbtOld = 'block';

function randomColor() {
  const r = Math.floor(Math.random() * 206) + 50;
  const g = Math.floor(Math.random() * 206) + 50;
  const b = Math.floor(Math.random() * 206) + 50;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function jsGenCodeOfBlock(block) {
  if (block.type == 'main_blockcreator') return;

  var name = block.getFieldValue('name');

  if (name) name = name.replace(/[^A-Za-z0-9_.-]/g, '_');

  if (block.type == 'input_value') {
    return `var val_${name} = generator.valueToCode(block, '${name}', javascript.Order.ATOMIC);`;
  } else if (block.type == 'input_statement') {
    return `var code_${name} = generator.statementToCode(block, '${name}');`
  } else if (block.type == 'field_variable') {
    return `var var_${name} = generator.getVariableName(block.getFieldValue('${name}'));`
  } else if (
    block.type.startsWith('field_') &&
    block.type != 'field_image' &&
    block.type != 'field_label' &&
    block.type != 'field_dropdownChoice'
  ) {
    return `var field_${name} = block.getFieldValue('${name}');`
  }

  return;
}

function getJavascriptGenerator() {
  const allBlocks = workspace.getAllBlocks();
  var code = `javascript.javascriptGenerator.forBlock['${window.mainBlockName}'] = function (block, generator) {`;

  allBlocks.forEach(block => {
    let jsGenCode = jsGenCodeOfBlock(block);
    if (jsGenCode) code += '\n' + jsGenCode;
  });

  if (window.mainBlockType == 'output') {
    return code + '\nvar code = `insert js code`;\nreturn [code, javascript.Order.NONE];\n};';
  } else {
    return code + '\nvar code = `insert js code`;\nreturn code;\n};';
  }
}

Blockly.Blocks['main_blockcreator'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("new block named")
      .appendField(new Blockly.FieldTextInput("block_name"), "NAME");
    this.appendStatementInput("INPUTS")
      .setCheck("Input")
      .appendField("with inputs");
    this.appendDummyInput()
      .appendField("set")
      .appendField(new Blockly.FieldDropdown([["automatic", "null"], ["inline", "true"], ["external", "false"]]), "INLINE")
      .appendField("inputs");
    this.appendDummyInput()
      .appendField("set type to")
      .appendField(new Blockly.FieldDropdown([["no connections", "none"], ["↤ output", "output"], ["↕ stack", "stack"], ["↧ hat block", "hat"], ["↥ end block", "end"]]), "TYPE");
    this.appendValueInput("OUTPUT")
      .setCheck(["OutputType", "Array"])
      .appendField("set output type to")
      .setVisible(false);
    this.appendValueInput("PREVIOUSSTATEMENT")
      .setCheck(["OutputType", "Array"])
      .appendField("set previous statement to")
      .setVisible(false);
    this.appendValueInput("NEXTSTATEMENT")
      .setCheck(["OutputType", "Array"])
      .appendField("set next statement to")
      .setVisible(false);
    this.appendDummyInput("OUTPUTSHAPE")
      .appendField("set shape to")
      .appendField(new Blockly.FieldDropdown([["automatic", "null"], ["boolean", "1"], ["round", "2"], ["square", "3"]]), "SHAPE")
      .setVisible(false);
    this.appendDummyInput()
      .appendField("set tooltip to")
      .appendField(new Blockly.FieldTextInput("tooltip"), "TOOLTIP");
    this.appendDummyInput()
      .appendField("set help url to")
      .appendField(new Blockly.FieldTextInput("url"), "HELPURL");
    this.appendValueInput("COLOUR")
      .setCheck("Colour")
      .appendField("set colour to");
    this.setInputsInline(false);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");

    this.onchange = function () {
      var fieldType = this.getInput('OUTPUT');
      var fieldShape = this.getInput('OUTPUTSHAPE');
      var fieldPrevious = this.getInput('PREVIOUSSTATEMENT');
      var fieldNext = this.getInput('NEXTSTATEMENT');
      var type = this.getFieldValue('TYPE');

      window.mainBlockType = 'block';

      if (type === 'output') {
        window.mainBlockType = 'output';
        fieldType.setVisible(true);
        fieldShape.setVisible(true);
        fieldPrevious.setVisible(false);
        fieldNext.setVisible(false);
      } else if (type === 'stack') {
        fieldType.setVisible(false);
        fieldShape.setVisible(false);
        fieldPrevious.setVisible(true);
        fieldNext.setVisible(true);
      } else if (type === 'hat') {
        fieldType.setVisible(false);
        fieldShape.setVisible(false);
        fieldPrevious.setVisible(false);
        fieldNext.setVisible(true);
      } else if (type === 'end') {
        fieldType.setVisible(false);
        fieldShape.setVisible(false);
        fieldPrevious.setVisible(true);
        fieldNext.setVisible(false);
      } else {
        fieldType.setVisible(false);
        fieldShape.setVisible(false);
        fieldPrevious.setVisible(false);
        fieldNext.setVisible(false);
      }

      if (mbtOld !== type) {
        mbtOld = type;
        window.jsCodeGenerator = getJavascriptGenerator();

        this.render();
      }

      checkForDuplicateInputNames(this);
    };
  }
};

function checkForDuplicateInputNames(mainBlock) {
  const inputNames = {};
  const allBlocks = workspace.getAllBlocks();

  allBlocks.forEach(block => {
    if (block == mainBlock) return;

    let thisWhat = false;

    if (block.type.startsWith('input_')) thisWhat = 'input';
    else if (block.type.startsWith('field_')) thisWhat = 'field';

    if (thisWhat) {
      var name = block.getFieldValue('name');
      if (!name) return;

      name = `duplicateTest_${thisWhat}_${name}`;

      if (inputNames[name]) {
        block.setWarningText(`This ${thisWhat} has a duplicate name; please choose a unique one.`);
      } else {
        inputNames[name] = true;
        block.setWarningText(null);
      }
    }
  });
}

javascript.javascriptGenerator.forBlock['main_blockcreator'] = function (block, generator) {
  var name = block.getFieldValue('NAME') || 'block_id_here';
  name = name.replace(/[^A-Za-z0-9_.-]/g, '_');

  var inputs = generator.statementToCode(block, 'INPUTS');
  var inline = block.getFieldValue('INLINE');
  var type = block.getFieldValue('TYPE');
  var shape = block.getFieldValue('SHAPE');
  var previousState = generator.valueToCode(block, 'PREVIOUSSTATEMENT', javascript.Order.ATOMIC) || null;
  var nextState = generator.valueToCode(block, 'NEXTSTATEMENT', javascript.Order.ATOMIC) || null;
  var tooltip = block.getFieldValue('TOOLTIP');
  var helpurl = block.getFieldValue('HELPURL');
  var colour = generator.valueToCode(block, 'COLOUR', javascript.Order.ATOMIC) || null;
  var output = generator.valueToCode(block, 'OUTPUT', javascript.Order.ATOMIC) || null;

  window.mainBlockName = name;
  window.jsCodeGenerator = getJavascriptGenerator();

  let typeCode;
  if (type === 'output') {
    typeCode = `\nthis.setOutput(true, ${output});`;

    if (shape != 'null') {
      typeCode += `\nthis.setOutputShape(${shape});`;
    }
  } else if (type === 'stack') {
    typeCode = `\nthis.setPreviousStatement(true, ${previousState});\nthis.setNextStatement(true, ${nextState});`;
  } else if (type === 'hat') {
    typeCode = `\nthis.setNextStatement(true, ${nextState});`;
  } else if (type === 'end') {
    typeCode = `\nthis.setPreviousStatement(true, ${previousState});`;
  } else {
    typeCode = '';
  }

  var code = `Blockly.Blocks['${name}'] = {
  init: function() {
  ${inputs}${inline != "null" ? `this.setInputsInline(${inline});\n` : ''}this.setColour('${colour}');
    this.setTooltip('${tooltip}');
    this.setHelpUrl('${helpurl}');${typeCode}
  }
};`;

  return code;
};

let newBlock = workspace.newBlock('main_blockcreator');
newBlock.initSvg();
newBlock.render();
newBlock.setDeletable(false);

let shadowBlock = workspace.newBlock('colour_picker');
shadowBlock.initSvg();
shadowBlock.render();
shadowBlock.setShadow(true);

let colourInput = newBlock.getInput('COLOUR');
if (colourInput) {
  colourInput.connection.connect(shadowBlock.outputConnection);
}