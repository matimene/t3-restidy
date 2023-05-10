import styled from "@emotion/styled";
import { Loader } from "tabler-icons-react";

//TODO: pass to component loader and append get store logo
export const Centered = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingSpinner = () => {
  return (
    <Centered>
      <Loader />
    </Centered>
  );
};
