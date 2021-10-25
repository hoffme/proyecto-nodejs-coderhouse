## Comandos

 - `npm run build`: compila el proyecto de typescript a javascript en la carpeta dist
 - `npm run start`: recompila siguiendo el comando build y luego inicia la aplicacion.
 - `npm run dev`: utilizando nodemon relanza la aplicacion al realizar un cambio en los archivos.

## Organizacion del proyecto

Todo el codigo del proyecto se encuentran en la carpeta src organizado segun los modulos jerarquicos.

#### Modulos

###### server
interfaces que se exponen al mundo exterior, utilizan los controllers para poder resolver las peticiones.

###### controllers
comunicador entre los servidores y modelos, se encarga de verificacion de tipos y logicas mas abstractas mediante el modulo de models.

###### models
contiene cada entidad y logica del negocio de la aplicacion, se le setea el dao del storage para guardar la informacion.

###### storage
implementa los DAO de los modelos.

## Inicio de la Aplicacion

La aplicacion al iniciarse tiene que cargar cada modulo, estos tiene una clase con propiedades y metodos estaticos. Cada modulo cumple con la interface Modulo el cual tiene que tener un metodo abstracto asyncrono "Setup" al cual se le pasa por parametros la configuraciones del mismo.

Los modulos se deben cargan siguiendo el flujo reverso a la informacion.
 
    Storage > Models > Controllers > Server.

## Flujo de la Informacion

Al ingresar una peticion, es interpretada por el modulo **server**, el cual se encarga de parsear los parametros, luego se lo delega al modulo de **controladores** que verifica los tipos de los parametros y mediante los modelos construyen la respuesta esperada. Los **modelos** tienen la logica mas abstracta de negocio de la aplicacion, y mediante la interface DAO se guarda la informacion, esta interface es implementada por el modulo **storage** el cual puede tener varias implementaciones (Memory, File, Mongo) segun la el archivo de configuracion.
