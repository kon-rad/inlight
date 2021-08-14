import Icon from './Icon';

const Header = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center mb-8 mt-4 ">
      <Icon name={icon} svgClassName="header__icon" />
      <h1 className="header__title text-lg">{title}</h1>
    </div>
  );
};

export default Header;
