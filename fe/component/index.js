import { defaultImport } from 'default-import';
import defaultStyled from 'styled-components';

const styled = defaultImport(defaultStyled);

export const Wrap = styled.div`
  margin: ${props => props.size === 'small' ? 5 : (props.size === 'large' ? 15 : 10)}px;
`