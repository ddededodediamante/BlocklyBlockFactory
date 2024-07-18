function compress(xml) {
  return pako.deflate(xml
    .replaceAll('</', '⏛')
    .replaceAll('field', '⏚')
    .replaceAll('statement', '⎋')
    .replaceAll('block', '⎌')
    .replaceAll('value', '⍝')
    .replaceAll('mutation', '⁌'), { to: 'string' });;
}

function decompress(xml) {
  return pako.inflate(xml, { to: 'string' })
    .replaceAll('⏛', '</')
    .replaceAll('⏚', 'field')
    .replaceAll('⎋', 'statement')
    .replaceAll('⎌', 'block')
    .replaceAll('⍝', 'value')
    .replaceAll('⁌', 'mutation');
}

var isDarkTheme = false;
var previewRender = localStorage.getItem('previewRender') || 'zelos';

const DarkTheme = Blockly.Theme.defineTheme('DarkTheme', {
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#1e1e1e',
    toolboxBackgroundColour: '#333',
    toolboxForegroundColour: '#fff',
    flyoutBackgroundColour: '#252526',
    flyoutForegroundColour: '#ccc',
    flyoutOpacity: 1,
    scrollbarColour: '#797979',
    insertionMarkerColour: '#fff',
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: '#d0d0d0',
  },
});

const LightTheme = Blockly.Theme.Classic;

Blockly.JavaScript.addReservedWords("Blockly");
Blockly.JavaScript.addReservedWords("Javascript");

// Initialize Blockly workspace
var workspace = Blockly.inject("blocklyDiv", {
  toolbox: document.getElementById("toolbox"),
  grid: {
    spacing: 20,
    length: 3,
    colour: "#4a4a4a",
    snap: false,
  },
  trashcan: true,
  theme: DarkTheme,
  renderer: "zelos",
  sounds: true,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.18,
    scaleSpeed: 1.1,
    pinch: true,
  },
});
// Initialize Preview Blockly workspace
var previewWorkspace = Blockly.inject('blocklyPreviewDiv', {
  grid: {
    spacing: 20,
    length: 3,
    colour: "#4a4a4a",
    snap: false,
  },
  theme: DarkTheme,
  renderer: previewRender,
  zoom: {
    startScale: 0.8,
  },
});

async function blockPreview() {
  if (!window.mainBlockName || !Blockly.Blocks[window.mainBlockName]) return;

  await previewWorkspace.clear();

  try {
    let block = await previewWorkspace.newBlock(window.mainBlockName);

    await block.initSvg()
    await block.setDeletable(false);
    await block.moveBy(5, 5);

    delete Blockly.Blocks[window.mainBlockName];
    delete Blockly.JavaScript[window.mainBlockName];
  } catch (error) {
    console.error('Error while rendering:', error);

    delete Blockly.Blocks[window.mainBlockName];
    delete Blockly.JavaScript[window.mainBlockName];

    return await previewWorkspace.clear();
  }
}

function emptyXml(xml) {
  return xml == '<xml xmlns="https://developers.google.com/blockly/xml"></xml>' || xml == '';
}

async function saveFile() {
  var xmlDom = await Blockly.Xml.workspaceToDom(workspace);
  var xmlText = compress(await Blockly.Xml.domToText(xmlDom));

  var blob = new Blob([xmlText], { type: "application/xml" });

  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: window.mainBlockName || 'block creator block',
      types: [{
        description: "Block Creator Workspace",
        accept: { "application/xml": [".bcw"] },
      }]
    });

    const writableStream = await fileHandle.createWritable();

    await writableStream.write(blob);
    await writableStream.close();

    console.log("File saved successfully!");
  } catch (err) {
    if (String(err) == "AbortError: The user aborted a request.") return;

    let textErr = "Error while saving the file: " + err;
    window.alert(textErr);
    console.error(textErr);
  }
}

async function loadFromFile() {
  try {
    const fileHandle = await window.showOpenFilePicker({
      types: [{
        description: "Block Creator Workspace",
        accept: { "application/xml": [".bcw"] },
      }]
    });

    const file = await fileHandle[0].getFile();
    const contents = await file.text();

    if (file && !emptyXml(contents)) {
      await workspace.clear();

      var parser = new DOMParser();
      var xmlDom = parser.parseFromString(decompress(contents), "application/xml");

      Blockly.Xml.domToWorkspace(xmlDom.documentElement, workspace);

      await updateCode();
    } else {
      window.alert('You can\'t load empty files.');
    }
  } catch (err) {
    if (String(err) == "AbortError: The user aborted a request.") return;

    let textErr = "Error while loading the file: " + err;
    window.alert(textErr);
    console.error(textErr);
  }
}

async function saveRecoveryXml() {
  var xmlDom = await Blockly.Xml.workspaceToDom(workspace);
  var xmlText = await compress(await Blockly.Xml.domToText(xmlDom));

  localStorage.setItem('recoverXml', xmlText);
}

async function updateCode(event) {
  if (event) {
    if (
      event.type == 'viewport_change' ||
      event.type == 'toolbox_item_select' ||
      event.type == 'block_field_intermediate_change'
    ) return;

    await saveRecoveryXml();
  }

  var code = Blockly.JavaScript.workspaceToCode(workspace);

  if (window.jsCodeGenerator) {
    code += '\n\n' + window.jsCodeGenerator;
  }

  code = js_beautify(code, {
    indent_size: 2,
    space_in_empty_paren: true
  });

  document.getElementById("textCode").textContent = code.trim();

  try {
    await previewWorkspace.clear();
    await eval(code);
    await blockPreview();
  } catch (err) { }
}

workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(updateCode);
updateCode();

document.addEventListener("DOMContentLoaded", async () => {
  await updateCode();

  previewWorkspace.addChangeListener(async (event) => {
    if (
      event.type == 'viewport_change' ||
      event.type == 'toolbox_item_select' ||
      event.type == 'block_field_intermediate_change'
    ) return;

    let topBlocks = await previewWorkspace.getTopBlocks();

    if (topBlocks && topBlocks.length > 1) {
      let amount = 0;
      await topBlocks.forEach((i, index) => {
        if (
          index == 0 ||
          !i ||
          !i.type ||
          !i.id ||
          i.disposed ||
          !previewWorkspace.blockDB.has(i.id)
        ) return;
        amount += 1;
        i.dispose(true);
      });

      console.log(`${amount} extra ${amount == 1 ? 'block' : 'blocks'} was disposed from the preview workspace.`)
    }
  });
});

const previewRenderDropdown = document.getElementById('previewRender');
previewRenderDropdown.value = previewRender;
previewRenderDropdown.addEventListener("change", async () => {
  if (!previewWorkspace) return;

  let value = previewRenderDropdown.value;
  previewRender = value;

  localStorage.setItem('previewRender', value);

  await previewWorkspace.dispose();
  previewWorkspace = await Blockly.inject('blocklyPreviewDiv', {
    grid: {
      spacing: 20,
      length: 3,
      colour: "#4a4a4a",
      snap: false,
    },
    theme: DarkTheme,
    renderer: previewRender,
    zoom: {
      startScale: 0.8,
    },
  });

  await updateCode();
});

async function downloadPreviewWorkspace(png) {
  // Both these functions are from here: https://github.com/google/blockly/blob/f94b1db85018b5a7261fa01f7d04cd5c8367fe2c/tests/playgrounds/screenshot.js
  async function svgToPng_(data, width, height, callback) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();

    var pixelDensity = 10;
    canvas.width = width * pixelDensity;
    canvas.height = height * pixelDensity;
    img.onload = function () {
      context.drawImage(
        img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
      try {
        var dataUri = canvas.toDataURL('image/png');
        callback(dataUri);
      } catch (err) {
        console.warn('Error converting the workspace svg to a png');
        callback('');
      }
    };
    img.src = data;
  }

  async function workspaceToSvg_(workspace, callback, pngAfter, customCss) {
    // Go through all text areas and set their value.
    var textAreas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textAreas.length; i++) {
      textAreas[i].innerHTML = textAreas[i].value;
    }

    var bBox = workspace.getBlocksBoundingBox();
    var x = bBox.x || bBox.left;
    var y = bBox.y || bBox.top;
    var width = bBox.width || bBox.right - x;
    var height = bBox.height || bBox.bottom - y;

    var blockCanvas = workspace.getCanvas();
    var clone = blockCanvas.cloneNode(true);
    clone.removeAttribute('transform');

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.appendChild(clone);
    svg.setAttribute('viewBox',
      x + ' ' + y + ' ' + width + ' ' + height);

    svg.setAttribute('class', 'blocklySvg ' +
      (workspace.options.renderer || 'geras') + '-renderer ' +
      (workspace.getTheme ? workspace.getTheme().name + '-theme' : ''));
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute("style", 'background-color: transparent');

    var css = [].slice.call(document.head.querySelectorAll('style'))
      .filter(function (el) {
        return /\.blocklySvg/.test(el.innerText) ||
          (el.id.indexOf('blockly-') === 0);
      }).map(function (el) {
        return el.innerText;
      }).join('\n');
    var style = document.createElement('style');
    style.innerHTML = css + '\n' + customCss;
    svg.insertBefore(style, svg.firstChild);

    var svgAsXML = (new XMLSerializer).serializeToString(svg);
    svgAsXML = svgAsXML.replace(/&nbsp/g, '&#160');
    var data = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);

    if (pngAfter && pngAfter === true) {
      svgToPng_(data, width, height, callback);
    } else {
      callback(data);
    }
  }

  try {
    var link;

    if (png) {
      await workspaceToSvg_(previewWorkspace, (datauri) => {
        link = document.createElement("a");
        link.href = datauri;
        link.download = (window.mainBlockName || 'block') + '.png';
        link.click();
      }, true).then(() => {
        delete link;
      });
    } else {
      await workspaceToSvg_(previewWorkspace, (datauri) => {
        link = document.createElement("a");
        link.href = datauri;
        link.download = (window.mainBlockName || 'block') + '.svg';
        link.click();
      }, false).then(() => {
        delete link;
      });
    }

    console.log("File saved successfully!");
  } catch (err) {
    let textErr = "Error while saving the file: " + err;
    window.alert(textErr);
    console.error(textErr);
  }
}