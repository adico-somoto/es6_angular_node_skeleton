//require('dotenv').config();

const mod = {
  app: {
    // time in second to wait for no activity in the conversion process before aborting
    conv_proc_timeout: 20000,
    socket_port: '8090',
    // and disconnecting the client and perform cleanup
  },
  cloudconv: {
    secret_key: 'VfqzppFoCOmhpMDJcLnuQyqX8SCiBDwbRGEHPByj6qcJiWmIGWRh25EswEFDKb3jNjmAjhkVLhfG3xbz63k0Iw',
  },
};

module.exports = mod;
