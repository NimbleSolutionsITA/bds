import styled from "@emotion/styled";
import {Typography} from "@mui/material";

const Waivy = styled.div`
  position: relative;
  width: 100%;
  text-align: center;   
  font-size: 60px;
  @keyframes waviy {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const Letter = styled.span<{ delay: number}>`
  position: relative;
  display: inline-block;
  color: #000;
  text-transform: uppercase;
  animation: waviy 1.4s infinite;
  animation-delay: calc(.2s * ${({delay}) => delay});
`

const Loading = () => {
    const letters = '...'.split('')
    return (
        <Waivy>
            {letters.map((letter, index) =>
                <Typography key={letter+index} variant="h1" component={Letter} delay={index} sx={{fontSize: '80px'}}>{letter}</Typography>
            )}
        </Waivy>
    )
}

export default Loading