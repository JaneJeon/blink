module.exports.largestIcon = icons =>
  icons[
    Object.keys(icons)
      .filter(key => key.startsWith('image') && key !== 'image_default')
      .sort((x, y) => y.substr(6) - x.substr(6))
  ]
