# Desarrollo de Sistemas Informáticos
### Práctica 9. Sistema de ficheros y creación de procesos en Node.js

* Autor: Saúl Pérez García
* Correo: alu0101129785@ull.edu.es
* Fecha de entrega: 02-05-2021

### --> Introducción

En esta práctica se plantean la implementación de una serie de ejercicios haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.

El código desarrolado será documentado con **typedoc**. Como en las prácticas anteriores, se hará uso de **GitHub Actions** que nos va a permitir automatizar, personalizar y ejecutar nuestros flujos de trabajo de desarrollo de software directamente en el repositorio.

Antes de continuar, es conveniente revisar la documentación que se adjunta a continuación sobre la **API de callbacks proporcionada por Node.js** para interactuar con el sistema de ficheros y el **API asíncrona proporcionada por Node.js** para crear procesos y, en concreto, con la función **spawn**.

También podremos encontrar información referida a la **API síncrona de Node.js** para trabajar con el sistema de ficheros, ya que tenemos la intención de guardar el contenido de las notas en diferentes ficheros.

* [Node.js](https://www.npmjs.com/package/@types/node)
* [API de callbacks proporcionada por Node.js](https://nodejs.org/dist/latest/docs/api/fs.html#fs_callback_api)
* [API asíncrona proporcionada por Node.js](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_asynchronous_process_creation)
* [Función spawn](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_child_process_spawn_command_args_options)

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### --> Ejercicio 2

El objetivo de este ejercicio es conseguir llevar a implementar una aplicación que logre un funcionamiento similar al del comando wc y sus diversas opciones tal y como podemos usar si consultamos su manual:

```
Usage: wc [OPTION]... [FILE]...
  or:  wc [OPTION]... --files0-from=F
Print newline, word, and byte counts for each FILE, and a total line if
more than one FILE is specified.  A word is a non-zero-length sequence of
characters delimited by white space.

With no FILE, or when FILE is -, read standard input.

The options below may be used to select which counts are printed, always in
the following order: newline, word, character, byte, maximum line length.
  -c, --bytes            print the byte counts
  -m, --chars            print the character counts
  -l, --lines            print the newline counts
      --files0-from=F    read input from the files specified by
                           NUL-terminated names in file F;
                           If F is - then read names from standard input
  -L, --max-line-length  print the maximum display width
  -w, --words            print the word counts
      --help     display this help and exit
      --version  output version information and exit
```

Es decir, necesitaremos de una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. La ruta donde se encuentra el fichero debe ser un parámetro pasado a la aplicación desde la línea de comandos. Adicionalmente, también deberá indicarle al programa desde la línea de comandos si desea visualizar el número de líneas, palabras, caracteres o combinaciones de ellas. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de yargs.

Además, debemos conseguir esto de dos formas diferentes: 

1. Haciendo uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
2. Sin hacer uso del método pipe, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada. Se recomienda la lectura de la documentación de [Stream](https://nodejs.org/api/stream.html) para el desarrolo de este ejercicio. 

Por último, se debe realizar una programación defensiva, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su programa. 

Por ejemplo, ¿qué sucede si indica desde la línea de comandos un fichero que no existe o una opción no válida?

Para resolver este ejercicio y mediante el uso de **yargs**, se han creado dos comandos, `pipe` y `event`.

Pipe, es un comando, que va a requerir como argumento obligatorio una ruta donde se deberá encontrar el fichero a analizar y luego podremos apsarle varios parámetros opciones siendo estos ``--lines` para contar las líneas del fichero, `--words` para contar las palabras que lo conforman o `--characters` para ver el número exacto de caracteres del mismo.

Los parámetros serán almacenados en un vecor de strings donde se irán haciendo push detro del mismo de cada uno de estos comandos si estos son empleados para luego ser usados por la función `spawn`, que nos devolverá un **child_process**. Su método de uso es `spawn('commad', [list with the command options, 'route']);`. 
En nuestro caso, vamos a crear una variable nueva, llamada `subprocess` de tipo `ChildProcessWithoutNullStreams` que va a recoger el spawn que tendrá como string el comando a usar que es `wc` y luego entre corchetes, el vector de strings que había rellenado, finalmente, le pasaremos la ruta donde va a estar el fichero a analizar. Veamos el fragmento de código:

```
      let subprocess = spawn('wc', [...args, argv.route]);
      subprocess.on('error', () => {
        console.log('Error with the command');
        process.exit(-1);
      });

      subprocess.stdout.pipe(process.stdout);
      subprocess.stderr.pipe(process.stderr);

      subprocess.on('close', (code) => {
        if(code) {
          console.log('Command exited with code ' + code);
        }
        process.exit(code);
      });
```

Aquí vemos además la callback en caso de error, tanto por un problema con el comando o porque el fichero no existe o se ha utilizado una opción no válida. En estos casos, redirigiríamos la salida del error como un error nuestro. Es decir, cuando este pograma falla, ahora se muestra un error indicando el motivo, debido a que se ha redigirido la salida del mismo como un error nuestro y que es mostrado por pantalla con el uso de `pipe` resolviendo de esta forma la pregunta formulada en el guión. Veamos un ejemplo de ejecución:

```

```


















### Integración continua de Typescript y Node.js con GitHub Actions


* [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07?branch=master)


* [![Test](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/actions/workflows/node.js.yml)


* [![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07)



// http://juandarodriguez.es/event-loop.html
/* http://latentflip.com/loupe/?code=aW1wb3J0IHsgYWNjZXNzLCBjb25zdGFudHMsIHdhdGNoIH0gZnJvbSAnZnMnOw0KDQppZiAocHJvY2Vzcy5hcmd2Lmxlbmd0aCAhPT0gMykgew0KICBjb25zb2xlLmxvZygnUGxlYXNlLCBzcGVjaWZ5IGEgZmlsZScpOw0KfSBlbHNlIHsNCiAgY29uc3QgZmlsZW5hbWUgPSBwcm9jZXNzLmFyZ3ZbMl07DQoNCiAgYWNjZXNzKGZpbGVuYW1lLCBjb25zdGFudHMuRl9PSywgKGVycikgPT4gew0KICAgIGlmIChlcnIpIHsNCiAgICAgIGNvbnNvbGUubG9nKGBGaWxlICR7ZmlsZW5hbWV9IGRvZXMgbm90IGV4aXN0YCk7DQogICAgfSBlbHNlIHsNCiAgICAgIGNvbnNvbGUubG9nKGBTdGFydGluZyB0byB3YXRjaCBmaWxlICR7ZmlsZW5hbWV9YCk7DQoNCiAgICAgIGNvbnN0IHdhdGNoZXIgPSB3YXRjaChwcm9jZXNzLmFyZ3ZbMl0pOw0KDQogICAgICB3YXRjaGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7DQogICAgICAgIGNvbnNvbGUubG9nKGBGaWxlICR7ZmlsZW5hbWV9IGhhcyBiZWVuIG1vZGlmaWVkIHNvbWVob3dgKTsNCiAgICAgIH0pOw0KDQogICAgICBjb25zb2xlLmxvZyhgRmlsZSAke2ZpbGVuYW1lfSBpcyBubyBsb25nZXIgd2F0Y2hlZGApOw0KICAgIH0NCiAgfSk7DQp9!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D
*/
// https://geekflare.com/es/javascript-event-loops/