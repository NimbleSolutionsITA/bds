import styled from "@emotion/styled";
import {Typography} from "@mui/material";

const Waivy = styled.div`
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

type LoadingProps = {
    fontSize?: string
}

const Loading = ({fontSize = '80px'}: LoadingProps) => {
    const letters = '...'.split('')
    return (
        <Waivy>
            {letters.map((letter, index) =>
                <Typography
                    key={letter+index}
                    component={Letter}
                    delay={index}
                    sx={{fontSize, lineHeight: fontSize}}
                >
                    {letter}
                </Typography>
            )}
        </Waivy>
    )
}

export default Loading