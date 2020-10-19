/* globals Struct, pako */
'use strict';

function MRI() {
  var me = {
    mriPath: null,      // path to mri
    mriFile: null,      // mri file
    //struct_url: 'http://localhost/structjs/struct.js',
    //pako_url: 'http://localhost/libs/pako/1.0.5/pako.js',
    struct_url: 'https://cdn.jsdelivr.net/gh/neuroanatomy/structjs@0.0.1/struct.js',
    pako_url: 'https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js',
    // script loader
    loadScript: function loadScript(path, testScriptPresent) {
      var pr = new Promise(function(resolve, reject) {
        console.log(testScriptPresent, testScriptPresent());
        if (testScriptPresent && testScriptPresent()) {
          console.log('Script', path, 'already present, not loading it again');
          resolve();

          return;
        }
        var s = document.createElement('script');
        s.src = path;
        s.onload = function() {
          console.log('Loaded', path);
          resolve();

          return;
        };
        s.onerror = function() {
          console.error('ERROR');
          reject();

          return;
        };
        document.body.appendChild(s);
      });

      return pr;
    },
    init: function init() {
      var pr = new Promise(function(resolve, reject) {
        me.loadScript(me.struct_url, function() { return window.Struct !== undefined; })
          .then(function() { return me.loadScript(me.pako_url, function() { return window.pako !== undefined; }); })
        /*
        var pr = me.loadScript('https://cdn.rawgit.com/r03ert0/mrijs/v0.0.2/mri.js',function(){return window.MRI!=undefined});
        */
          .then(function() {
            if (!me.NiiHdrLE) {
              me.NiiHdrLE = Struct()
                .word32Sle('sizeof_hdr')        // Size of the header. Must be 348 (bytes)
                .chars('data_type', 10)         // Not used; compatibility with analyze.
                .chars('db_name', 18)           // Not used; compatibility with analyze.
                .word32Sle('extents')           // Not used; compatibility with analyze.
                .word16Sle('session_error')     // Not used; compatibility with analyze.
                .word8('regular')               // Not used; compatibility with analyze.
                .word8('dim_info')              // Encoding directions (phase, frequency, slice).
                .array('dim', 8, 'word16Sle')   // Data array dimensions.
                .floatle('intent_p1')           // 1st intent parameter.
                .floatle('intent_p2')           // 2nd intent parameter.
                .floatle('intent_p3')           // 3rd intent parameter.
                .word16Sle('intent_code')       // nifti intent.
                .word16Sle('datatype')          // Data type.
                .word16Sle('bitpix')            // Number of bits per voxel.
                .word16Sle('slice_start')       // First slice index.
                .array('pixdim', 8, 'floatle')  // Grid spacings (unit per dimension).
                .floatle('vox_offset')          // Offset into a .nii file.
                .floatle('scl_slope')           // Data scaling, slope.
                .floatle('scl_inter')           // Data scaling, offset.
                .word16Sle('slice_end')         // Last slice index.
                .word8('slice_code')            // Slice timing order.
                .word8('xyzt_units')            // Units of pixdim[1..4].
                .floatle('cal_max')             // Maximum display intensity.
                .floatle('cal_min')             // Minimum display intensity.
                .floatle('slice_duration')      // Time for one slice.
                .floatle('toffset')             // Time axis shift.
                .word32Sle('glmax')             // Not used; compatibility with analyze.
                .word32Sle('glmin')             // Not used; compatibility with analyze.
                .chars('descrip', 80)           // Any text.
                .chars('aux_file', 24)          // Auxiliary filename.
                .word16Sle('qform_code')        // Use the quaternion fields.
                .word16Sle('sform_code')        // Use of the affine fields.
                .floatle('quatern_b')           // Quaternion b parameter.
                .floatle('quatern_c')           // Quaternion c parameter.
                .floatle('quatern_d')           // Quaternion d parameter.
                .floatle('qoffset_x')           // Quaternion x shift.
                .floatle('qoffset_y')           // Quaternion y shift.
                .floatle('qoffset_z')           // Quaternion z shift.
                .array('srow_x', 4, 'floatle')  // 1st row affine transform
                .array('srow_y', 4, 'floatle')  // 2nd row affine transform.
                .array('srow_z', 4, 'floatle')  // 3rd row affine transform.
                .chars('intent_name', 16)       // Name or meaning of the data.
                .chars('magic', 4);             // Magic string.
            }
            if (!me.NiiHdrBE) {
              me.NiiHdrBE = Struct()
                .word32Sbe('sizeof_hdr')        // Size of the header. Must be 348 (bytes)
                .chars('data_type', 10)         // Not used; compatibility with analyze.
                .chars('db_name', 18)           // Not used; compatibility with analyze.
                .word32Sbe('extents')           // Not used; compatibility with analyze.
                .word16Sbe('session_error')     // Not used; compatibility with analyze.
                .word8('regular')               // Not used; compatibility with analyze.
                .word8('dim_info')              // Encoding directions (phase, frequency, slice).
                .array('dim', 8, 'word16Sbe')   // Data array dimensions.
                .floatbe('intent_p1')           // 1st intent parameter.
                .floatbe('intent_p2')           // 2nd intent parameter.
                .floatbe('intent_p3')           // 3rd intent parameter.
                .word16Sbe('intent_code')       // nifti intent.
                .word16Sbe('datatype')          // Data type.
                .word16Sbe('bitpix')            // Number of bits per voxel.
                .word16Sbe('slice_start')       // First slice index.
                .array('pixdim', 8, 'floatbe')  // Grid spacings (unit per dimension).
                .floatbe('vox_offset')          // Offset into a .nii file.
                .floatbe('scl_slope')           // Data scaling, slope.
                .floatbe('scl_inter')           // Data scaling, offset.
                .word16Sbe('slice_end')         // Last slice index.
                .word8('slice_code')            // Slice timing order.
                .word8('xyzt_units')            // Units of pixdim[1..4].
                .floatbe('cal_max')             // Maximum display intensity.
                .floatbe('cal_min')             // Minimum display intensity.
                .floatbe('slice_duration')      // Time for one slice.
                .floatbe('toffset')             // Time axis shift.
                .word32Sbe('glmax')             // Not used; compatibility with analyze.
                .word32Sbe('glmin')             // Not used; compatibility with analyze.
                .chars('descrip', 80)           // Any text.
                .chars('aux_file', 24)          // Auxiliary filename.
                .word16Sbe('qform_code')        // Use the quaternion fields.
                .word16Sbe('sform_code')        // Use of the affine fields.
                .floatbe('quatern_b')           // Quaternion b parameter.
                .floatbe('quatern_c')           // Quaternion c parameter.
                .floatbe('quatern_d')           // Quaternion d parameter.
                .floatbe('qoffset_x')           // Quaternion x shift.
                .floatbe('qoffset_y')           // Quaternion y shift.
                .floatbe('qoffset_z')           // Quaternion z shift.
                .array('srow_x', 4, 'floatbe')  // 1st row affine transform
                .array('srow_y', 4, 'floatbe')  // 2nd row affine transform.
                .array('srow_z', 4, 'floatbe')  // 3rd row affine transform.
                .chars('intent_name', 16)       // Name or meaning of the data.
                .chars('magic', 4);             // Magic string.
            }
            resolve();
          });
      });

      return pr;
    },

    /**
      * @function createNifti
      * @desc create a nifti1 file
      * @param dim array Array with 3 integers with the x, y and z dimensions of the data
      * @param pixdim array Array with 3 floats with the x, y and z sizes of the data voxels's
      * @param v2w array Array containing 4 arrays, each containing 4 floats, giving the affine voxel-to-world matrix of the data
      * @param data array An array of size dim[0]*dim[1]*dim[2] containing the data to be encoded
      * @returnValue Gzip compressed nifti format data
      */

    createNifti: function createNifti(dim, pixdim, v2w, data) {
      let sizeof_hdr = 348;
      let dimensions = 4;          // number of dimension values provided
      let spacetimeunits = 2 + 8;    // 2=nifti code for millimetres | 8=nifti code for seconds
      let datatype = 16;           // datatype for Float32 data
      let vox_offset = 352;
      let bitsPerVoxel = 32;

      let newHdr = {
        sizeof_hdr: sizeof_hdr,
        data_type: '', db_name: '', extents: 0, session_error: 0, regular: 0, dim_info: 0,
        dim: [3, dim[0], dim[1], dim[2], 1, 1, 1, 1],
        intent_p1: 0, intent_p2: 0, intent_p3: 0, intent_code: 0,
        datatype: datatype,      // uchar
        bitpix: bitsPerVoxel,
        slice_start: 0,
        pixdim: [-1, pixdim[0], pixdim[1], pixdim[2], 0, 1, 1, 1],
        vox_offset: vox_offset,
        scl_slope: 1, scl_inter: 0, slice_end: 0, slice_code: 0,
        xyzt_units: spacetimeunits,
        cal_max: 0, cal_min: 0, slice_duration: 0, toffset: 0,
        glmax: 0, glmin: 0,
        descrip: 'Reorient, 5 January 2018',
        aux_file: '',
        qform_code: 0,
        sform_code: 1,
        quatern_b: 0, quatern_c: 0, quatern_d: 0,
        qoffset_x: 0, qoffset_y: 0, qoffset_z: 0,
        srow_x: [v2w[0][0], v2w[0][1], v2w[0][2], v2w[0][3]],
        srow_y: [v2w[1][0], v2w[1][1], v2w[1][2], v2w[1][3]],
        srow_z: [v2w[2][0], v2w[2][1], v2w[2][2], v2w[2][3]],
        intent_name: '',
        magic: 'n+1'
      };
      me.NiiHdrLE.allocate();
      let niihdr = me.NiiHdrLE.buffer();
      let i;
      for(i in newHdr) {
        me.NiiHdrLE.fields[i] = newHdr[i];
      }
      let hdr = toArrayBuffer(niihdr);


      let img = new Float32Array(data.length); //Buffer(sz);
      for(i = 0; i<data.length; i++) {
        img[i] = data[i];
      }
      let nii = new Uint8Array(img.buffer.byteLength + vox_offset);
      nii.set(hdr, 0);
      nii.set(new Uint8Array(img.buffer), vox_offset);

      var niigz = new pako.Deflate({gzip:true});
      niigz.push(nii, true);

      return niigz.result;
    },

    /**
      * @function saveNifti
      * @desc save a nifti1 file
      */
    saveNifti: function saveNifti(niigz, name) {
      var a = document.createElement('a');
      var niigzBlob = new Blob([niigz]);
      a.href = window.URL.createObjectURL(niigzBlob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
    },
    loadMRIFromPath: function loadMRIFromPath(path, updateProgress) {
      var pr = new Promise(function(resolve, reject) {
        // load data
        var req = new XMLHttpRequest();
        req.open('GET', path, true);
        req.responseType = 'arraybuffer';
        req.onload = function(oEvent) {
          // decompress data
          var niigz = this.response;
          var inflate = new pako.Inflate();
          try {
            inflate.push(new Uint8Array(niigz), true);
          } catch(err) {
            return reject(err);
          }
          if(inflate.ended !== true) {
            return reject(new Error("File ended prematurely"));
          }
          var nii = inflate.result.buffer;
          me.parseNifti(nii);
          me.mriPath = path;
          me.computeS2VTransform();
          me.MatrixVox2Mm = me.vox2mm();
          me.MatrixMm2Vox = me.mm2vox();
          console.log('done');
          resolve();
        };
        req.addEventListener("progress", updateProgress);
        req.onerror = function() {
          reject('Error loading data');
        };
        req.send();
      });

      return pr;
    },
    loadMRIFromFile: function loadMRIFromFile(file) {
      var pr = new Promise(function(resolve, reject) {

        const arr = file.name.split(".");
        let compressed = true;
        if(arr[arr.length - 1] === "gz" && arr[arr.length - 2] === "nii") {
          compressed = true;
        } else if (arr[arr.length - 1] === "nii") {
          compressed = false;
        } else {
          alert("Unknown file format. Only nii and nii.gz are accepted");
          reject();
        }

        // load data
        var reader = new FileReader();
        reader.onload = function() {
          let nii;

          // decompress data if necessary
          if(compressed) {
            var niigz = this.result;
            var inflate = new pako.Inflate();
            try {
              inflate.push(new Uint8Array(niigz), true);
            } catch(err) {
              return reject(err);
            }
            if(inflate.ended !== true) {
              return reject(new Error("File ended prematurely"));
            }
            nii = inflate.result.buffer;
          } else {
            nii = this.result;
          }

          me.parseNifti(nii);
          me.computeS2VTransform();
          me.MatrixVox2Mm = me.vox2mm();
          me.MatrixMm2Vox = me.mm2vox();
          console.log('done');
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });

      return pr;
    },
    NiiHdrLE: null,
    NiiHdrBE: null,
    swapInt16: function swapInt16(arr) {
      var i,dv = new DataView(arr.buffer);
      for (i = 0; i < arr.length; i++) {
        arr[i] = dv.getInt16(2 * i, false);
      }

      return arr;
    },
    swapUint16: function swapUint16(arr) {
      var i,dv = new DataView(arr.buffer);
      for (i = 0; i < arr.length; i++) {
        arr[i] = dv.getUint16(2 * i, false);
      }

      return arr;
    },
    swapInt32: function swapInt32(arr) {
      var i,dv = new DataView(arr.buffer);
      for (i = 0; i < arr.length; i++) {
        arr[i] = dv.getInt32(4 * i, false);
      }

      return arr;
    },
    swapFloat32: function swapFloat32(arr) {
      var i,dv = new DataView(arr.buffer);
      for (i = 0; i < arr.length; i++) {
        arr[i] = dv.getFloat32(4 * i, false);
      }

      return arr;
    },

    /**
      * @function parseNifti
      */
    parseNifti: function parseNifti(nii) {
      var endianness = 'le';

      me.NiiHdrLE._setBuff(toBuffer(nii));
      var h = JSON.parse(JSON.stringify(me.NiiHdrLE.fields));
      if (h.sizeof_hdr !== 348) {
        me.NiiHdrBE._setBuff(toBuffer(nii));
        h = JSON.parse(JSON.stringify(me.NiiHdrBE.fields));
        endianness = 'be';
      }

      var vox_offset = h.vox_offset;
      var sizeof_hdr = h.sizeof_hdr;

      me.hdr = nii.slice(0, vox_offset);
      me.datatype = h.datatype;
      me.dim = [h.dim[1], h.dim[2], h.dim[3]];
      me.datadim = h.dim[4];
      console.log(me.datadim);
      me.pixdim = [h.pixdim[1], h.pixdim[2], h.pixdim[3]];

      switch (me.datatype) {
        case 2: // UCHAR
          me.data = new Uint8Array(nii, vox_offset);
          break;
        // case 256: // INT8
        //   me.data = new Uint8Array(nii,vox_offset);
        //   break;
        case 4: // SHORT
          if (endianness === 'le') {
            me.data = new Int16Array(nii, vox_offset);
          } else {
            me.data = me.swapInt16(new Int16Array(nii, vox_offset));
          }
          break;
        case 8: // INT
          if (endianness === 'le') {
            me.data = new Int32Array(nii, vox_offset);
          } else {
            me.data = me.swapInt32(new Int32Array(nii, vox_offset));
          }
          break;
        case 16: // FLOAT
          if (endianness === 'le') {
            me.data = new Float32Array(nii, vox_offset);
          } else {
            me.data = me.swapFloat32(new Float32Array(nii, vox_offset));
          }
          break;
        case 256: // INT8
          me.data = new Int8Array(nii, vox_offset);
          break;
        case 512: // UINT16
          if (endianness === 'le') {
            me.data = new Uint16Array(nii, vox_offset);
          } else {
            me.data = me.swapUint16(new Uint16Array(nii, vox_offset));
          }
          break;
        default:
          console.error('Unknown dataType: ' + me.datatype);
      }
    },
    multMatVec: function multMatVec(m, v) {
      return [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3]
      ];
    },
    multMatMat: function multMatMat(m, n) {
      return [
        [m[0][0]*n[0][0]+m[0][1]*n[1][0]+m[0][2]*n[2][0]+m[0][3]*n[3][0], m[0][0]*n[0][1]+m[0][1]*n[1][1]+m[0][2]*n[2][1]+m[0][3]*n[3][1], m[0][0]*n[0][2]+m[0][1]*n[1][2]+m[0][2]*n[2][2]+m[0][3]*n[3][2], m[0][0]*n[0][3]+m[0][1]*n[1][3]+m[0][2]*n[2][3]+m[0][3]*n[3][3]],
        [m[1][0]*n[0][0]+m[1][1]*n[1][0]+m[1][2]*n[2][0]+m[1][3]*n[3][0], m[1][0]*n[0][1]+m[1][1]*n[1][1]+m[1][2]*n[2][1]+m[1][3]*n[3][1], m[1][0]*n[0][2]+m[1][1]*n[1][2]+m[1][2]*n[2][2]+m[1][3]*n[3][2], m[1][0]*n[0][3]+m[1][1]*n[1][3]+m[1][2]*n[2][3]+m[1][3]*n[3][3]],
        [m[2][0]*n[0][0]+m[2][1]*n[1][0]+m[2][2]*n[2][0]+m[2][3]*n[3][0], m[2][0]*n[0][1]+m[2][1]*n[1][1]+m[2][2]*n[2][1]+m[2][3]*n[3][1], m[2][0]*n[0][2]+m[2][1]*n[1][2]+m[2][2]*n[2][2]+m[2][3]*n[3][2], m[2][0]*n[0][3]+m[2][1]*n[1][3]+m[2][2]*n[2][3]+m[2][3]*n[3][3]],
        [m[3][0]*n[0][0]+m[3][1]*n[1][0]+m[3][2]*n[2][0]+m[3][3]*n[3][0], m[3][0]*n[0][1]+m[3][1]*n[1][1]+m[3][2]*n[2][1]+m[3][3]*n[3][1], m[3][0]*n[0][2]+m[3][1]*n[1][2]+m[3][2]*n[2][2]+m[3][3]*n[3][2], m[3][0]*n[0][3]+m[3][1]*n[1][3]+m[3][2]*n[2][3]+m[3][3]*n[3][3]]
      ];
    },
    inv4x4Mat: function inv4x4Mat(m) {
      let inv = [];
      let det, i;

      inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
      inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
      inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
      inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] +m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
      inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
      inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
      inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
      inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
      inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
      inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
      inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
      inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
      inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
      inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
      inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
      inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
      det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

      if (det === 0) {
        return;
      }
      det = 1.0 / det;
      for (i = 0; i < 16; i++) {
        inv[i] = inv[i] * det;
      }

      return inv;
    },

    /**
      * @function vox2mm
      * @desc Obtain the affine matrix to pass from voxel indices to world
      *     coordinates (millimetres) from the nifti header
      */
    vox2mm: function vox2mm() {
      var h = JSON.parse(JSON.stringify(me.NiiHdrLE.fields));

      return [
        [h.srow_x[0], h.srow_x[1], h.srow_x[2], h.srow_x[3]],
        [h.srow_y[0], h.srow_y[1], h.srow_y[2], h.srow_y[3]],
        [h.srow_z[0], h.srow_z[1], h.srow_z[2], h.srow_z[3]],
        [0, 0, 0, 1]
      ];
    },

    /**
      * @function mm2vox
      * @desc Compute the affine matrix to pass from coordinates in world
      *     dimensions (millimetres) voxel indices by inverting the vox2mm
      *     matrix.
      */
    mm2vox: function mm2vox() {
      var m = me.vox2mm();
      var im = me.inv4x4Mat([...m[0], ...m[1], ...m[2], ...m[3]]);

      return [im.splice(0, 4), im.splice(0, 4), im.splice(0, 4), im];
    },
    /**
      * @todo Additional transformation functions
      */
    /*
    vox2pix: function vox2pix() {
    },
    pix2vox: function pix2vox() {
    },
    mm2pix: function mm2pix() {
    },
    pix2mm: function pix2mm() {
    },
*/

    /**
    * @function computeS2VTransformation
    * @desc Find the orthogonal rotation closest to the orientation of the brain
    */
    computeS2VTransform: function computeS2VTransform() {
      var h = JSON.parse(JSON.stringify(me.NiiHdrLE.fields));
      var v2w = [
        [h.srow_x[0], h.srow_y[0], h.srow_z[0]],
        [h.srow_x[1], h.srow_y[1], h.srow_z[1]],
        [h.srow_x[2], h.srow_y[2], h.srow_z[2]]
      ];

      var mi = {i: 0, v: 0}; v2w[0].map(function(o, n) { if (Math.abs(o) > Math.abs(mi.v)) { mi = {i: n, v: o}; } });
      var mj = {i: 0, v: 0}; v2w[1].map(function(o, n) { if (Math.abs(o) > Math.abs(mj.v)) { mj = {i: n, v: o}; } });
      var mk = {i: 0, v: 0}; v2w[2].map(function(o, n) { if (Math.abs(o) > Math.abs(mk.v)) { mk = {i: n, v: o}; } });

      me.s2v = {
        x: mi.i, // correspondence between screen coordinate x and voxel coordinate i
        y: mj.i, // same for y
        z: mk.i, // same for z
        dx: (mi.v > 0) ? 1 : (-1), // direction of displacement in space coordinate x with displacement in voxel coordinate i
        dy: (mj.v > 0) ? 1 : (-1), // same for y
        dz: (mk.v > 0) ? 1 : (-1), // same for z
        X: (mi.v > 0) ? 0 : (me.dim[0] - 1), // starting value for space coordinate x when voxel coordinate i starts
        Y: (mj.v > 0) ? 0 : (me.dim[1] - 1), // same for y
        Z: (mk.v > 0) ? 0 : (me.dim[2] - 1), // same for z
        sdim: [],
        wpixdim: []
      };
      me.s2v.sdim[mi.i] = me.dim[0];
      me.s2v.sdim[mj.i] = me.dim[1];
      me.s2v.sdim[mk.i] = me.dim[2];
      me.s2v.wpixdim[mi.i] = me.pixdim[0];
      me.s2v.wpixdim[mj.i] = me.pixdim[1];
      me.s2v.wpixdim[mk.i] = me.pixdim[2];
    }
  };

  return me;
}
