import { useState } from 'react';
import { Box, Button, Card, CardContent, CardActions, Typography, TextField, CircularProgress } from '@mui/material';
import * as yup from 'yup';


import { useAuthContext } from '../../contexts';


const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(5),
});

interface ILoginProps {
    children: React.ReactNode;
}

export const Login: React.FC<ILoginProps> = ({ children }) => {

  const { isAuthenticated, login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = () => {
    setIsLoading(true);
    loginSchema
      .validate({ email, password }, { abortEarly: false })
      .then(dadosValidados => {
        login(dadosValidados.email, dadosValidados.password)
          .then(() => {
            setIsLoading(false);
          });
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);
        errors.inner.forEach(error => {
          if (error.path === 'email') setEmailError(error.message);
          if (error.path === 'password') setPasswordError(error.message);
        });
      });
  };

  if (isAuthenticated) return (
    <>{children}</>
  );

  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>
      <Card>
        <CardContent>
          <Box width={250} display='flex' flexDirection='column' gap={2}>
            <Typography variant='h6' align='center'>
              Faça login para acessar o sistema
            </Typography>
            <TextField 
              fullWidth
              label='Email'
              type='email'
              value={email}
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={() => setEmailError('')}
            />
            <TextField 
              fullWidth
              label='Senha'
              type='password'
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={() => setPasswordError('')}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : null}
            >
              Entrar
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};