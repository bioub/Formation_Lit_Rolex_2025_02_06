# Exercices

## Exercice 1 : listes et classMap

Dans `pages/users.js` remplacer le contenu du HTML suivant :

```html
<nav>
  <a class="active" href="#"> Toto </a>
  <a href="#"> Titi </a>
  <a href="#"> Tata </a>
</nav>
```

Par celui présent dans la propriété reactive `users` en utilisant la fonction `.map`

Ajouter la classe `active` uniquement sur les `id` pairs avec la directive `classMap`

## Exercice 2 : CSS

Dans `pages/users.js` remplacer la couleur `lightblue` par une variable CSS `--my-bg-color`

Faire de même dans `components/top-bar.js`

Dans le fichier `index.css` affecter la valeur `lightgreen` à cette variable dans `:root` 


## Exercice 3 : Binding et Event

Dans `pages/home.js` ajouter le html suivant :

```html
<h1>Home</h1>
<p>Welcome to the home page!</p>
<div>
  <input
    type="text"
    placeholder="Enter your name"
  />
</div>
<p>Hello YOUR_NAME!</p>
```

Créer une propriété `name` de type `String`, avec `state: true`.

Créer un constructeur pour lui donner une valeur par défaut (ex: `Romain`)

Afficher cette valeur dans le champ et à la place de `YOUR_NAME`

Ecouter l'événement `input` et modifier le state correspondant à la frappe clavier.

## Exercice 4 : Communication

Dans le composant `components/users-filter` :

Créer la propriété reactive `filter` et l'afficher dans le champ

Passer la propriété searchTerm depuis le composant `pages/users` à cette propriété `filter` (tester avec une valeur différente de `''` qu'elle s'affiche dans le champ)

A la frappe dans le champ modifier cette propriété `filter` et remonte la valeur avec un Custom event `filter-changed`

Ajouter ensuite ce filtre au niveau du `.map` pour n'afficher que les users dont le nom contient le filtre :

```js
.filter((u) =>
  u.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
)
```

## Exercice 5

Créer un contrôleur `UsersController` dans le dossier `services`

Y ajouter cette méthode :

```js
async hostConnected() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  this.items = await res.json();
  this.host.requestUpdate();
}
```

Et instancier le contrôleur dans les propriété de `pages/users.js`

Afficher ensuite les valeurs du contrôleur (`items`) plutôt que celle du composant (`users`)

## Exercice 6

Dans `di.js` créer une config qui associe la clé `'settings-store'` à un objet `SettingsStore` (celui présent dans `services/SettingsStore.js`)

Injecter ce service dans `pages/settings` et `components/top-bar` et y ajouter la méthode suivante :

```js
connectedCallback() {
  super.connectedCallback();
  this.store.addHost(this);
}
```

Dans `components/top-bar` afficher le titre présent dans le `SettingsStore` 
Dans `pages/settings` afficher ce titre dans le champ et au submit du formulaire appeler la méthode `updateTitle` du store.

## Exercice 7

Dans `routes.js` ajouter une clé `chidren` à la route `users` :

```js
children: [
  
],
```

Il faudra définir 2 enfants :
- un dont le path et vide et une méthode 
```js
render: () => html`<p>Select a user from the list</p>`
```

- l'autre dont le path est le paramètre `:userId` et le composant associé `UserDetailsComponent` du fichier `pages/user-details.js`

Modifier ensuite le code de `pages/users` :
- ajouter `<rlx-flx-router-view></rlx-flx-router-view>` dans la colonne de droite
- créer des liens vers `user-details` et mettre la classe `active` uniquement sur le lien actif.

## Exercice 8

Créer une Async Task pour récupérer les données de `https://jsonplaceholder.typicode.com/users/${userId}` (où `${userId}` est l'id présent dans la route).

Afficher les données avec un loader et une erreur via les 3 fonctions : `pending`, `error` et`complete`