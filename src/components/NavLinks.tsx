import classNames from 'classnames';
import { ActiveLink } from '../types/ActiveLink';

type Props = {
  activeLink: ActiveLink;
  setActiveLink: (l: ActiveLink) => void;
};

export const NavLinks = ({ activeLink, setActiveLink }: Props) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: activeLink === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => {
          setActiveLink('all');
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: activeLink === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => {
          setActiveLink('active');
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: activeLink === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          setActiveLink('completed');
        }}
      >
        Completed
      </a>
    </nav>
  );
};
