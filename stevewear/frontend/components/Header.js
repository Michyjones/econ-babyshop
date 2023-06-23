import Link from 'next/link';
import styled from 'styled-components';
import Nav from './Nav';

const Logo = styled.h1`
  font-size: 4rem;
  background: skyblue;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-10deg);
  a {
    color: green;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
`;

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--skyblue, skyblue);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--skyblue, skyblue);
  }
`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className="bar">
        <Link href="/">
          <Logo>Stevewear</Logo>
        </Link>
      </div>
      <div className="sub-bar">
        <p>Search</p>
      </div>
      <Nav />
    </HeaderStyles>
  );
}
