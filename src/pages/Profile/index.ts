import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import getValidationErrors from '../../utils/getValidationErrors';
import {Container, Content} from './styles'

import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Cadastro Realizado',
          description: 'Você já pode fazer seu logon no GoBarber!',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no Cadastro',
          description:
            'Ocorreu ou erro no cadastro. Cheque as informações digitadas e tente novamente.',
        });
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="Gobarber" />
        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" type="text" icon={FiUser} placeholder="Nome" />
          <Input name="email" type="text" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            type="password"
            icon={FiLock}
            placeholder="Senha"
          />
          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft /> Voltar para o logon
        </Link>
      </Content>
    </Container>
  );
};

export default Profile;
