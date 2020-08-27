const logger = require('../lib/Logger').instance

logger.info('Default')
logger.warn('Default')
logger.error('Default')

logger.level = 2

logger.info('Level 2')
logger.warn('Level 2')
logger.error('Level 2')

logger.level = 1

logger.info('Level 1')
logger.warn('Level 1')
logger.error('Level 1')

logger.level = 0

logger.info('Level 0')
logger.warn('Level 0')
logger.error('Level 0')
