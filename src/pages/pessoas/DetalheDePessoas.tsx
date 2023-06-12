import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useNavigate, useParams } from 'react-router-dom';
import { FerramentasDeDetalhe } from '../../shared/components';
import { useEffect, useState } from 'react';
import { IDetalhePessoa, PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { VTextField, VForm, useVForm, IVFormErros } from '../../shared/forms';

import * as yup from 'yup';

interface IFormData {
  nomeCompleto: string;
  email: string;
  cidadeId: number;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required().min(3),
  email: yup.string().required().email(),
  cidadeId: yup.number().required(),
});

export const DetalheDePessoas: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      PessoasService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate('/pessoas');
        } else {
          setNome(result.nomeCompleto);
          console.log(result);

          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        email: '',
        cidadeId: '',
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados: Omit<IDetalhePessoa, 'id'>) => {
        setIsLoading(true);
        if (id === 'nova') {
          PessoasService.create(dadosValidados).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                alert('Salvo com sucesso!');
                navigate('/pessoas');
              } else {
                alert('Salvo com sucesso!');
                navigate(`/pessoas/detalhe/${result}`);
              }
            }
          });
        } else {
          PessoasService.updateById(Number(id), { id: Number(id), ...dadosValidados }).then(
            (result) => {
              setIsLoading(false);
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  alert('Salvo com sucesso!');
                  navigate('/pessoas');
                } else {
                  alert('Salvo com sucesso!');
                }
              }
            }
          );
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErros = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });
        formRef.current?.setErrors(validationErrors);
      });

    
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir?'))
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Excluído com sucesso!');
          navigate('/pessoas');
        }
      });
  };

  return (
    <LayoutBaseDePagina
      titulo={id !== 'nova' ? 'Edição de: ' + nome : 'Nova Pessoa'}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
          aoClicarEmVoltar={() => navigate('/pessoas')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Nome"
                  name="nomeCompleto"
                  disabled={isLoading}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Email"
                  name="email"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row">
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Cidade ID"
                  name="cidadeId"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
