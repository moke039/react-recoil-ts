# recoil チュートリアル

https://recoiljs.org/docs/basic-tutorial/intro  
の Todo List アプリを TS 化 v0.0.4
https://recoiljs.org/docs/guides/testing/  
で recoil な jest テストを追加できた。 v0.0.5  
カバレッジが取れていないことに気づいて修正 v0.0.6。  
フォルダの位置関係によってカバレッジが取れなくなる様子だったので修正。  
(src/\_\_test\_\_ でもテストは走るがカバレッジが取れないようだった。)

TodoItemCreator のみ単体での評価が可能。  
TodoItem なら表示の単体テストが可能だが、index がうまく定まらず編集の評価はできない。TodoList で評価した。  
TodoListFilters も同様に TodoList での評価を実施。RecoilObserver の node を filteredTodoListState に変えている。

App.test.tsx で snapshot も試してみている。  
テストケースのコメントを変更すると snapshot の exports も変化する。

```
npm run test -- --clearCache
```

してみたけど、TodoList に丸められて、l つ 1 つのカバレッジは取れない様子だった。

Create React App で test coverage が出力されない時の対処

- Qiita https://qiita.com/nbstsh/items/024391eb1c8ad068d2f6

```
npm run test -- --coverage --watchAll=false
```

でないと、カバレッジ計測結果を出力中に watch が走ってしまうらしい。

```
npm run cov
```

で実行可能。

package.json の devDependencies にテスト関連のモジュールを分けてみた。
package-lock.json で関連モジュールに

> "dev": true,

がつくようになる。

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
