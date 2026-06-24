import styled from "styled-components";
import BoxWithHeadline from "@/components/page-structure/Elements/BoxWithHeadline";

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
`;

export const XpTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    text-align: right;
    color: #888;
    padding-bottom: 8px;
    font-weight: normal;
  }

  td {
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f5;
  }
`;

export const THRight = styled.th`
  text-align: right !important;
  display: table-cell;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
`;

export const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: right;

  &:first-child {
    font-weight: bold;
    color: #555;
  }
`;

export const EmptyState = styled.p`
  padding: 15px;
  text-align: center;
  color: #888;
  font-style: italic;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Hebelt das Padding des Elternelements radikal aus */
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);

    /* Bestimme hier jetzt deinen WUNSCH-Abstand zum echten Displayrand */
    padding-left: 8px; /* Ändere das auf 4px oder 0px, wenn es noch schmaler sein soll! */
    padding-right: 8px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: -10px;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Gibt den Admin-Buttons einen minimalen Abstand vom Rand */
    padding: 0 8px;
  }
`;

export const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Schrumpft die Boxen minimal, damit links und rechts ein perfekter, kleiner Spalt entsteht */
    width: calc(100% - 16px);
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1.8fr 1.2fr;
    align-items: start;
    gap: 25px;
    width: 100%;
  }
`;

export const PrimaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
`;

export const SecondaryColumn = styled.div`
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
  }
`;

export const DesktopCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  gap: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: center;
    /* Nutzt exakt dieselbe Breite wie das MainGrid darunter */
    width: calc(100% - 16px);
    margin-left: auto;
    margin-right: auto;
    padding: 16px;
    gap: 16px;
  }
`;

export const ImageWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    border-radius: 12px;
    overflow: hidden;
  }
`;

export const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const TitleRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
    margin-bottom: 20px;
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; /* Sorgt dafür, dass der Textblock die volle Breite der InfoSection einnimmt */

  h1 {
    color: #2d5a27;
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

export const TitleHeadlineRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Schiebt die Herkunft jetzt bis ganz nach rechts */
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
`;
export const OriginRow = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const OriginRowSpecialCoat = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  background: #f1f8e9;
  padding: 6px 12px;
  border-radius: 20px;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  width: fit-content;

  span {
    font-weight: 600;
  }
`;

export const ReleaseDate = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
`;

export const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr) minmax(180px, 1.2fr);
    justify-content: start;
    gap: 15px;
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;

    & > :last-child {
      grid-column: span 2;
    }
  }

  /* Mobil: Schaltet das Grid komplett ab, damit die Gruppen stur untereinander fließen */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const StatsGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;

  & > * {
    flex: 1;
  }

  @media (min-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const EnclosureBox = styled(BoxWithHeadline)`
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 4px;
  }
`;

export const SpecialCoatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    justify-content: start;
  }
`;

export const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;

  background: #fdfdfd;
  border: 1.5px solid #d1e2a5;
  border-radius: 30px;
  padding: 8px 24px;
  width: fit-content;

  color: #2d5a27;
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

  margin: 25px 0 0 5px;

  &::after {
    @media (min-width: 769px) {
      content: "";
      flex: 1;
      height: 1.5px;
      background-color: #d1e2a5;
      margin-left: 20px;
      opacity: 0.5;
      min-width: 100px;
    }
  }

  @media (max-width: 768px) {
    margin: 30px auto 20px auto;
    font-size: 1.15rem;
    padding: 6px 20px;
    justify-content: center;
  }
`;

export const StyledSpecialCoatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  max-width: none;
  margin: 0 auto;

  height: auto;
  min-height: 260px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    width: 230px;
    margin: 0;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: #4a7c2a;
    background: #ffffff;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const SpecialCoatName = styled.span`
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  display: block;
  width: 100%;
  word-wrap: break-word;
`;
