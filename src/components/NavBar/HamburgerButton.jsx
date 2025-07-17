const HamburgerButton = ({ isOpen, toggle }) => (
    <button onClick={toggle} aria-label="Menú" className="z-[100] relative flex flex-col gap-[6px]">
        <span
            className={`h-[2px] w-6 bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
        />
        <span
            className={`h-[2px] w-6 bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''
                }`}
        />
    </button>
);

export default HamburgerButton;
  