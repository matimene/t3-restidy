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
};

export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify ?? "flex-start"};
  align-items: ${(props) => props.align ?? "flex-start"};
  gap: ${(props) => props.gap ?? 0}px;
  margin: ${(props) => props.margin ?? ""};
  margin-top: ${(props) => props.marginTop ?? 0}px;
  margin-bottom: ${(props) => props.marginBottom ?? 0}px;
  max-width: 100%;
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const TwoLineLable = styled.div`
  display: -webkit-box;
  max-width: 400px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
