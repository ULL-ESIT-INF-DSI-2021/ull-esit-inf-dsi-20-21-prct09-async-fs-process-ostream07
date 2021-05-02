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

Aquí vemos además la callback en caso de error, tanto por un problema con el comando o porque el fichero no existe o se ha utilizado una opción no válida. En estos casos, redirigiríamos la salida del error como un error nuestro. Es decir, cuando este pograma falla, ahora se muestra un error indicando el motivo, debido a que se ha redigirido la salida del mismo como un error nuestro y que es mostrado por pantalla con el uso de `pipe` resolviendo de esta forma la pregunta formulada en el guión. Veamos unos ejemplos de ejecución:

```
node src/exercise-2.js pipe --route README.txt --lines --words --characters
wc: README.txt: No existe el archivo o el directorio
Command exited with code 1
```
El fichero README.txt no existe y por tanto, se lanza el error.

```
node src/exercise-2.js event --route README.md --lines --words --characters
  262  2128 17276 README.md
```

```
node src/exercise-2.js pipe --route README.md --lines --words --characters
  262  2128 17276 README.md
```

Se puede ver como en ambos casos muestra el mismo número de líneas, palabras y caracteres que tenía en ese momento el README.md.

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### --> Ejercicio 3

A partir de la aplicación de procesamiento de notas desarrollada en la práctica anterior, tenemos que conseguir una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. 
Gestionaremos los parámetros desde la línea de comandos haciendo uso de yargs. La aplicación a desarrollar deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. Nótese que no hace falta modificar absolutamente nada en la aplicación de procesamiento de notas. Es una aplicación que se va a utilizar para provocar cambios en el sistema de ficheros.
Su funcionamiento será simple, en una terminal usaremos [watch](https://nodejs.org/dist/latest/docs/api/fs.html#fs_fs_watch_filename_options_listener) para escuchar, mientras que en la otra tendremos abierta la práctca anterior realizando cambios en las notas y podremos ver que esto nos lo reflejará la función watch por la terminal.

Con cada cambio detectado en el directorio observado, el programa debe emitir un **Watcher** para indicar si se ha añadido, modificado o borrado una nota, además de indicar el nombre concreto del fichero creado, modificado o eliminado para alojar dicha nota. Veamos un fragmento del código:

```
if (typeof argv.route === 'string' && typeof argv.user === 'string') {
      const directoryName: string = argv.route;
      access(argv.route, constants.F_OK, (err) => {
        if (err) {
          console.log(`Directory ${directoryName} does not exist!`);
        } else {
          const watcher = watch(directoryName);

          watcher.on('change', (eventType, fileName) => {
            switch (eventType) {
              case 'rename':
                access(join(directoryName, fileName.toString()), constants.F_OK, (err) => {
                  if(err) {
                    console.log(`File ${fileName} was deleted`);
                  } else {
                    console.log(`File ${fileName} was created`);
                  }
                });
              case 'change':
                console.log(`File ${fileName} was modified`);
            }
          });
        }
      });
    }
```

Apoyándonos en yargs, vamos a tener un comando llamado **watch** que necesitará obligatoriamente de dos prámetros, uno con la ruta de lo que vamos a escuchar y el nombre del usuario de este directorio. Lo primero que haremos, será comprobar si el directorio existe y sino, lanzar un mensaje de error. Una vez superado este punto, vamos a tener dos tipos de eventos que se pueden emitir, un evento de tipo `rename` siempre que el fichero sea borrado o eliminado o un evento tipo `change` que saldrá en caso de que el objetivo que estamos observando sea modificado.

Veamos un ejemplo de ejecución:

```
Terminal 1:

node src/exercise-3.js watch --route ../../prueba/edusegre --user=edusegre
```

Al ejecutar este comando, se mantiene esperando que algo cambie en la ruta que le hemos proporcioando, vamos a ver que pasa si abrimos otra terminal y realizamos un cambio:

```
Terminal 2: 

npx ts-node src/index.ts add --user="edusegre" --title="Test note" --body="This is a test note" --color="green"
New note added!

Terminal 1:

File index.json was modified
File index.json was modified
File Test_note.json was modified
File Test_note.json was modified
File Test_note.json was created
```

Podemos ver en este caso, como se ha creado con éxito una nueva nota y hemos podido observar los cambios ocurridos sobre ese directorio. Ahora vamos a intentar eliminar esta nota para ver qué ocurre:

```
Terminal 2: 

npx ts-node src/index.ts remove --user="edusegre" --title="Test note"
Correctly removed

Terminal 1:

File Test_note.json was modified
File Test_note.json was deleted
File index.json was modified
```

Como debía pasar, la nota fue correctamente eliminada, y pudimos observar desde nuestra terminal los cambios que se produjeron en el directorio que estábamos observando. 

Ahora podemos responder a las preguntas que se nos formulan en el guión de la práctica:

* ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?

La respuesta es hacer un readfile al fichero cuando se crea o cuando se modifica, es decir, leemos el fichero primero y en caso de que no haya un error imprimimos el contenido.

* ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

Para poder realizar esto, tendríamos que indicarle el directorio donde se van a encontrar todos los directorios de la notas de los usuarios e indicarle la opción **recursive**. Le mandas un objeto con recursive y si el recursive es true va a escuchar todos los ficheros que cuelgan de este directorio donde están las carpetas del usuario.


# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### --> Ejercicio 4

Finalmente, para este ejercicio vamos a crear una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

1. Dada una ruta concreta, mostrar si es un directorio o un fichero ``(comando stat)``.
2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro ``(comando mkdir)``.
3. Listar los ficheros dentro de un directorio ``(comando list)``.
4. Mostrar el contenido de un fichero ``(comando cat)``.
5. Borrar ficheros y directorios ``(comando rm)``.
6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino ``(comando cp)``.

Para interactuar con la aplicación a través de la línea de comandos vamos a requerir de yargs.

Como en los ejercicios anteriores, con yargs podremos definir una serie de comandos, estos serán los siguientes:

* stat
* mkdir
* ls
* cat
* rm
* cp

Todos ellos, a excepción del comando `cp` van a requerir de un único parámetro, que será la ruta del fichero o directorio destino para aplicar estos comandos. Por su parte, **cp** va a necesitar no solo la ruta de origen sino también una ubicación de destino. Además, va a usar una función llamada `recursiveCopy` que nos va a permitir un directorio que tenga contenido en su interior de forma recursiva.

recursiveCopy(origin: string, destiny: string) recibe como parámetros la ruta de origen y la de destino. Esta llama a la función stat, que tiene la dirección de origen y un callback de error en caso de que algo estuviera mal y de stats, que va a revisar si es un directorio. En caso de no serlo, será un fichero por lo que no va a necesitar que lo copien recursivamente y se hará uso de la función `copyFile` que tendrá la ruta de destino, así com unas callbacks en caso de que algo vaya mal.

Suponiendo que se trata de un directorio, llamamos a `basename` que va  tener la ruta de origen y luego vamos a crear una nueva variable que al hacer un `join` con la dirección de destino y el fileName, llamaremos a `mkdir` para que la cree. Si algo sale mal, saltará la callback de error. También puede pasar que exista un problema al leer el contenido con `readdir` para poder copiarlo luego, es por ello que debemos preveer también el posible error lanzando un mensaje con un problema listando el contenido.
Finalmente, si llegamos al `forof` de la línea 21, recorremoscada uno de los files y hacemos que la función se llame así misma para realizar la copia recursiva en el directorio de destino. Esto podemos verlo en el código siguiente correspondiente a la función que acabamos de analizar: 

```
stat(origin, (err, stats) => {
    if (err) {
      console.log('Error!');
    } else {
      if (stats.isDirectory()) {
        let fileName = basename(origin);
        let newFolder = join(destiny, fileName);
        mkdir(newFolder, (err) => {
          if (err) {
            console.log('Error while copying');
          } else {
            readdir(origin, (err, files) => {
              if (err) {
                console.log('Error listing the content');
              } else {
                for (const file of files) {
                  recursiveCopy(join(newFolder, file), join(origin, file));
                }
              }
            })
          }
        });
      } else {
        stat(destiny, (err, stats) => {
          if (err) {
            if (err.code === 'ENOENT') {
              copyFile(origin, destiny, (err) => {
                if (err) {
                  console.log('Error while copying 34');
                }
              })
            }
            console.log('Error');
          } else {
            if (stats.isDirectory()) {
              destiny = join(destiny, basename(origin));
            }
            copyFile(origin, destiny, (err) => {
              if (err) {
                console.log('Error while copying 45');
              }
```

Finalmente, veamos algunos ejemplos de ejecución:

```
node src/exercise-4.js stat --route src
The given route is a directory

node src/exercise-4.js mkdir --route ejemplo
Directory created

node src/exercise-4.js ls --route ejemplo
Directory content: 
```

Ahora dentro de ejemplo vamos a crear dos ficheros:
touch file1.txt 
touch file2.txt

```
node src/exercise-4.js ls --route ejemplo
Directory content: 
        file1.txt
        file2.txt

node src/exercise-4.js cat --route ejemplo/file1.txt
estos es el ejemplo 1

node src/exercise-4.js cp --destinyRoute ejemplo --originRoute README.md

node src/exercise-4.js ls --route ejemplo
Directory content: 
        README.md
        file1.txt
        file2.txt

node src/exercise-4.js rm --route ejemplo
Deleted
```











### Integración continua de Typescript y Node.js con GitHub Actions


* [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07?branch=master)


* [![Test](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07/actions/workflows/node.js.yml)


* [![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct09-async-fs-process-ostream07)



// http://juandarodriguez.es/event-loop.html
/* http://latentflip.com/loupe/?code=aW1wb3J0IHsgYWNjZXNzLCBjb25zdGFudHMsIHdhdGNoIH0gZnJvbSAnZnMnOw0KDQppZiAocHJvY2Vzcy5hcmd2Lmxlbmd0aCAhPT0gMykgew0KICBjb25zb2xlLmxvZygnUGxlYXNlLCBzcGVjaWZ5IGEgZmlsZScpOw0KfSBlbHNlIHsNCiAgY29uc3QgZmlsZW5hbWUgPSBwcm9jZXNzLmFyZ3ZbMl07DQoNCiAgYWNjZXNzKGZpbGVuYW1lLCBjb25zdGFudHMuRl9PSywgKGVycikgPT4gew0KICAgIGlmIChlcnIpIHsNCiAgICAgIGNvbnNvbGUubG9nKGBGaWxlICR7ZmlsZW5hbWV9IGRvZXMgbm90IGV4aXN0YCk7DQogICAgfSBlbHNlIHsNCiAgICAgIGNvbnNvbGUubG9nKGBTdGFydGluZyB0byB3YXRjaCBmaWxlICR7ZmlsZW5hbWV9YCk7DQoNCiAgICAgIGNvbnN0IHdhdGNoZXIgPSB3YXRjaChwcm9jZXNzLmFyZ3ZbMl0pOw0KDQogICAgICB3YXRjaGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7DQogICAgICAgIGNvbnNvbGUubG9nKGBGaWxlICR7ZmlsZW5hbWV9IGhhcyBiZWVuIG1vZGlmaWVkIHNvbWVob3dgKTsNCiAgICAgIH0pOw0KDQogICAgICBjb25zb2xlLmxvZyhgRmlsZSAke2ZpbGVuYW1lfSBpcyBubyBsb25nZXIgd2F0Y2hlZGApOw0KICAgIH0NCiAgfSk7DQp9!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D
*/
// https://geekflare.com/es/javascript-event-loops/