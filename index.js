const fulltest = require('./run/fulltest')
const startParser = require('./run/parser')
const makeDictionary = require('./run/dictionary')
const translateProducts = require('./run/translate')
const startUpload = require('./run/upload')

require('yargs')
  .command('parse <store> <table>', 'Начать парсинг', yargs => {
    yargs
      .positional('store', {
        describe: 'Название магазина',
        type: 'string'
      })
      .positional('table', {
        describe: 'Путь к таблице с категориями',
        type: 'string'
      })
      .option('collection', {
        alias: 'c',
        default: ''
      })
  }, async args => {
    console.log('Выполняется парсинг')

    await startParser(args.store, args.table, args.collection)
  })
  .command('fulltest', 'Провести тестирование парсера с реальными запросами', yargs => {}, async args => {
    console.log('Выполняется полное тестирование')

    await fulltest()
  })
  .command('dictionary <collection> <savepath>', 'Создать словари цветов и размеров', yargs => {
    yargs
      .positional('collection', {
        describe: 'Название коллекции в БД для обработки'
      })
      .positional('savepath', {
        describe: 'Каталог для сохранения словарей'
      })
  }, async args => {
    console.log('Выполняется генерация словарей')

    await makeDictionary(args.collection, args.savepath)
  })
  .command('translate <collection> <colorspath> <sizespath>', 'Выполнить перевод цветов и размеров с помощью словарей', yargs => {
    yargs
      .positional('collection', {
        describe: 'Название коллекции в БД для обработки'
      })
      .positional('colorspath', {
        describe: 'Путь к CSV-словарю цветов'
      })
      .positional('sizespath', {
        describe: 'Путь к CSV-словарю размеров'
      })
  }, async args => {
    console.log('Выполняется перевод с помощью словарей')

    await translateProducts(args.collection, args.colorspath, args.sizespath)
  })
  .command('upload <collection>', 'Загрузка товаров в ВК', yargs => {
    yargs
      .positional('collection', {
        describe: 'Название коллекции которую нужно загрузить'
      })
  }, async args => {
    console.log('Выполняется загрузка товаров')

    await startUpload(args.collection)
  })
  .command('transform <xlsx> <savepath>', 'Преобразование горизонтальных таблиц в вертикальные', yargs => {
    yargs
      .positional('xlsx', {
        describe: 'Путь к XLSX файлу с товарами',
        type: 'string'
      })
      .positional('savepath', {
        describe: 'Путь к каталогу для сохранения CSV',
        type: 'string'
      })
  }, args => {
    console.log('Выполняется конвертация таблиц')

    console.log(args)
  })
  .argv
