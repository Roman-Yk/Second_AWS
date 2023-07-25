import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { I18n } from 'react-polyglot';
import { locale, dictionary } from '../translation';


export const createApp = (App: React.ElementType, store: any) => {
  ReactDOM.render(
    (
      <Provider store={store}>
        <I18n locale={locale} messages={dictionary[locale]}>
          <App />
        </I18n>
      </Provider>
    ),
    document.getElementById('root')
  );
}

