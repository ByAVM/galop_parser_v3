const { formatText } = require('../lib/Utilities')

const text = '\n' +
'\n' +
'\t\t\n' +
'\t\t\n' +
'\t\t\n' +
'\t\t\n' +
'\n' +
'\t\t\n' +
'\n' +
'        \n' +
'\n' +
'\t\t\t\t\n' +
'\t\t\n' +
'\t\t\n' +
'\t\t\t\t\n' +
'\t\t<p class="subline">ESKADRON Platinum Schabracke Velvet Crystal</p>\n' +
'\n' +
'\t\t\t\t\t\n' +
'\n' +
'\t<ul class="content-list"><li>edel in Samt-Optik</li><li>glitzernd mit Crystalsteinen</li><li>mit Kunstfell-Polsterung</li><li>Limited Edition!</li></ul>\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\t\t\n' +
'\t\t\n' +
'\n' +
'\t\t\t\t\t\t\t\t\t\t<p class="content-text">Von ESKADRON stammt die Schabracke Velvet Crystal und geh&#xF6;rt zur Platinum Kollektion. Das Samt-Obermaterial verleiht in Kombination mit der Steppung einen absolut edlen und eleganten Ausdruck. Komfortabel wird die Schabracke durch die Cool/Dry-Unterseite, die f&#xFC;r eine gute Schwei&#xDF;ableitung und eine optimale Atmungsaktivit&#xE4;t sorgt und das abklettbare FauxFur-Widerristpolster, das Druck- und Scheuerstellen verhindert. Der  beidseitige Lurex PLATINUM-Schrtiftzug und die elegante &apos;Kordel-Kristallstein-Kordel&apos; Kombination auf der Glossy-Einfassung unterstreichen den eleganten Schick.<br><br>Ma&#xDF;e:<br>- Dressur: ca. 60&#xA0;cm x 56&#xA0;cm<br>- Vielseitigkeit: ca. 58&#xA0;cm x 49&#xA0;cm<br><br>Die Platinum-Edition von ESKADRON ist eine exklusive und stark limitierte Auflage! Edle Materialien geben den Produkten einen ganz eleganten Look. Bitte haben Sie Verst&#xE4;ndnis daf&#xFC;r, dass Produkte dieser Kollektion nicht f&#xFC;r den t&#xE4;glichen Trainingsbetrieb oder extreme Belastungen konzipiert wurden und auch gerade bei der W&#xE4;sche sensibel behandelt werden sollten, damit Sie lange Freude daran haben.</p>\n' +
'\t\t\t\t\t\t\t\n' +
'\t\t\n' +
'\n' +
'\t\t\n' +
'\t\t\t\t\t\n' +
'\t\n' +
'\n' +
'<ul class="content-list unordered-list"><li>Material: 100 % Polyester</li><li>waschbar bis 30&#xB0;C</li></ul>\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\n' +
'\t\t\n' +
'\t\t<div class="CLEAR"></div>\n' +
'\t'


console.log(formatText(text))