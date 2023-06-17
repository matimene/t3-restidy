import styled from "@emotion/styled";

type RowProps = {
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  align?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  gap?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
};

export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify ?? "flex-start"};
  align-items: ${(props) => props.align ?? "flex-start"};
  gap: ${(props) => props.gap ?? 0}px;
  margin: ${(props) => props.margin ?? ""};
  margin-left: ${(props) => (props.ml || props.marginLeft) ?? 0}px;
  margin-right: ${(props) => (props.mr || props.marginRight) ?? 0}px;
  margin-top: ${(props) => (props.mt || props.marginTop) ?? 0}px;
  margin-bottom: ${(props) => (props.mb || props.marginBottom) ?? 0}px;
  max-width: 100%;
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  @media only screen and (max-width: 1080px) {
    flex-wrap: wrap;
  }
`;

export const TwoLineLable = styled.div`
  display: -webkit-box;
  max-width: 400px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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

export const SmtWrong = () => <Centered>Something went wrong</Centered>;

export const GradientDivider = styled.div<{
  w?: number;
  mt?: number;
  gradient?: number;
}>`
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: 3px;
  background: ${({ theme, gradient }) =>
    gradient ? theme.colors.gradient?.[gradient] : theme.colors.gradient?.[0]};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : "")};
`;
