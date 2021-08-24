javascript = open('./src/app.js', 'r').read()
css = open('./src/styles.css', 'r').read()
html = open('./src/index.html', 'r').read()


css_elem = f'''
    <style>
{css}
    </style>
'''

javascript_elem = f'''
    <script>
{javascript}
    </script>
'''

javascript_to_replace = '    <script src="./app.js"></script>'
css_to_replace = '    <link rel="stylesheet" href="./styles.css" />'

html = html.replace('    <script src="./app.js"></script>', javascript_elem)
html = html.replace('    <link rel="stylesheet" href="./styles.css" />', css_elem)

open('./DatabaseBrowser.html', 'w').write(html)