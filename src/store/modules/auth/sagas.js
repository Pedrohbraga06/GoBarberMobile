import { Alert } from 'react-native';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

import { signInSuccess, signInFailure, signUpFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      Alert.alert('Erro', 'E-mail e senha são obrigatórios');
      yield put(signInFailure());
      return;
    }

    const response = yield call(api.post, '/sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!token || !user) {
      Alert.alert('Erro', 'Resposta inválida do servidor');
      yield put(signInFailure());
      return;
    }

    if (user.provider) {
      Alert.alert(
        'Erro no login',
        'O usuário não pode ser prestador de serviços',
      );
      yield put(signInFailure());
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) ||
      'Verifique suas credenciais';
    Alert.alert('Falha na autenticação', errorMessage);
    yield put(signInFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    if (!name || !email || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      yield put(signUpFailure());
      return;
    }

    const response = yield call(api.post, '/users', {
      name,
      email,
      password,
    });

    if (!response.data) {
      Alert.alert('Erro', 'Falha ao criar conta');
      yield put(signUpFailure());
      return;
    }

    Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Sign up error:', error);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) ||
      'Houve um erro no cadastro, verifique seus dados';
    Alert.alert('Falha no cadastro', errorMessage);
    yield put(signUpFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
