import {styled} from "@mui/material/styles";

type BulletProps = {
	width?: string | number;
	isGrey?: boolean;
}

const Bullet = styled('div')`
  width: ${({width}: BulletProps) => width || '15px'};
  height: ${({width}: BulletProps) => width || '15px'};
  margin: 0 5px;
  border: ${({isGrey}: BulletProps) => isGrey ? 'none' : '2px solid white'};
  background-color: ${({isGrey}: BulletProps) => isGrey ? 'lightgrey' : 'transparent'};
  border-radius: 50%;
  box-shadow: ${({isGrey}: BulletProps) => isGrey ? 'none' : '1px 1px 1px 1px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: background-color 0.2s;
  &.active {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

export default Bullet