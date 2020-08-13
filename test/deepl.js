const deepl = require('../lib/translate/deepl')
require('dotenv').config()
deepl('Lined with soft fleece lining in the back area as a lightweight between-seasons rug or as  protection on cool days.        \n' 
+
    '        - 600 denier polyester- Breathable- Waterproof (3000 mm water column) - Multi-adjustable front fastening- Padded withers- Rings for attaching a neck part- Kick pleat- Crossover straps- Leg straps- Tail flap- With practical Waldhausen rug bag    \n' +
    '        Outer material: 100% polyesterLining: 100% polyester', process.env.DEEPL_API_KEY)
      .then(console.log)