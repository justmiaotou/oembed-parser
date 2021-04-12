const {extract} = require('./src/main');


const run = async (url, params) => {
  try {
    const art = await extract(url, params);
    console.log(art);
  } catch (err) {
    console.trace(err);
  }
};

const init = (argv) => {
  if (argv.length >= 3) {
    const url = argv[2];
    const [ , , , ...paramsArr] = argv
    let paramsObj = {}
    paramsArr.forEach((param) => {
      param = param.split('=')
      paramsObj[param[0]] = param[1]
    })
    return run(url, paramsObj);
  }
  return 'Nothing to do!';
};


init(process.argv);
