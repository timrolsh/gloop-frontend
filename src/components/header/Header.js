import {Container, Navbar, Nav, Dropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {routes} from "~/consts/routes";
import env from "~/env";
import eventEmitter from "~/utils/emitter";
import {events} from "~/consts/events";
import {useUser} from "~/hooks/user";
import {useAccount} from "wagmi";
import useUserStore from "~/stores/client/user";
import ConnectWalletButton from "~/components/wallet/ConnectWalletButton";

// images
import logo from "~/assets/img/logo.svg";
import mobile_logo from "~/assets/img/mobile-logo.svg";
import twitter_url from "~/assets/img/twitter.svg";
import discord_url from "~/assets/img/discord.svg";
import book_url from "~/assets/img/book.svg";
import m_url from "~/assets/img/m.svg";
import dropdown_close_url from "~/assets/img/dropdown-close.svg";
import dropdown_open_url from "~/assets/img/dropdown-open.svg";

export default function Header() {
  const links = [
    routes.Borrow,
    routes.Lend,
    routes.Staking,
    routes.Gmi,
    routes.Liquidate,
    routes.Leaderboard,
    {name: "Docs", path: env.DOCS_URL}
  ];
  const {pathname: currentUrl} = useLocation();
  const {isConnected, isDisconnected, address, isReconnecting, isConnecting} = useAccount();
  const navigate = useNavigate();
  const {logout} = useUser();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [resourceDropDownVisible, setResourceDropDownVisible] = useState(false);

  window.addEventListener("click", (e) => {
    if (
      !document.querySelector(".navbar-toggler").classList.contains("collapsed") &&
      e.target !== document.querySelector(".navbar-toggler") &&
      e.target !== document.querySelector(".navbar-toggler-icon") &&
      e.target !== document.querySelector("#resource_dropdown")
    ) {
      closeMobileMenu();
    }
  });
  const closeMobileMenu = () => {
    var aa = window.innerWidth;
    if (aa < 980) {
      document.querySelector(".navbar-toggler").click();
    }
  };

  const handleNavigate = (e, link) => {
    e.preventDefault();

    if (link.locked) return;

    const target = link.name === "Docs" ? "_blank" : "_self";

    if (target === "_blank") window.open(link.path, "_blank");
    else navigate(link.path);

    closeMobileMenu();
  };

  const handleUnauthorized = () => {
    if (isAuthenticated()) logout();
  };

  useEffect(() => {
    eventEmitter.on(events.Unauthorized, handleUnauthorized);

    // Clean up the event listener on component unmount
    return () => {
      eventEmitter.off(events.Unauthorized, handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    if (!address && !isConnected && isDisconnected && !isConnecting && !isReconnecting)
      logout(null, true);
  }, [address, isConnected, isDisconnected, isConnecting, isReconnecting]);

  return (
    <header>
      <Navbar expand="lg">
        <Container className="py-3">
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} width="140px" className="desktop-show" />
              <img src={mobile_logo} width="54px" className="mobile-show" />
            </Link>
          </Navbar.Brand>

          <ConnectWalletButton isMobile={true} />

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="my-2 d-flex align-items-center">
              <Dropdown
                onClick={() => setResourceDropDownVisible((prev) => !prev)}
                className="mobile-show"
              >
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <span id="resource_dropdown">Resources</span>
                  <img
                    src={resourceDropDownVisible ? dropdown_open_url : dropdown_close_url}
                    width={6}
                    className="mx-2"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href={env.DOCS_URL} target="_blank">
                    Documentation
                  </Dropdown.Item>
                  <Dropdown.Item href={"/"} target="_blank">
                    Guide
                  </Dropdown.Item>
                  {/* <Dropdown.Item href={env.GITHUB_URL} target='_blank'>Github</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>

              {links.map((link, index) => (
                <>
                  {" "}
                  {link.locked ? (
                    <span className="menu-item font-14 color-white-50 none-text-line px-2">
                      {link.name} (Soon)
                    </span>
                  ) : (
                    <Link
                      key={index}
                      to={link.path}
                      onClick={(e) => handleNavigate(e, link)}
                      className={`menu-item font-14 color-white-50 none-text-line px-2 ${
                        currentUrl === link.path ? "active_menu" : ""
                      }`}
                      // target={link.name === 'Docs' ? '_blank' : '_self'}
                    >
                      {link.name}
                    </Link>
                  )}
                </>
              ))}

              {/* {!isAuthenticated() && <Link onClick={() => handleOpenReferralModal()} className={`menu-item font-14 color-white-50 none-text-line px-2`}>Referrals</Link>} */}

              <div className="menu-item mobile-show  px-2 mt-2">
                <a href={env.Twitter_URL} target="_blank" className="social-item" rel="noreferrer">
                  <img src={twitter_url} width={18} />
                </a>
                <a href={env.Discord_URL} target="_blank" className="social-item" rel="noreferrer">
                  <img src={discord_url} width={18} />
                </a>
                <a href={env.DOCS_URL} target="_blank" className="social-item" rel="noreferrer">
                  <img src={book_url} width={18} />
                </a>
                <a href={env.MEDIUM_URL} target="_blank" className="social-item" rel="noreferrer">
                  <img src={m_url} width={18} />
                </a>
              </div>
            </Nav>
          </Navbar.Collapse>

          <ConnectWalletButton />
        </Container>
      </Navbar>
    </header>
  );
}
