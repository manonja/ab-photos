import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoCard } from '../PhotoCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || 'Photo'} />,
}));

describe('PhotoCard', () => {
  const defaultProps = {
    title: 'Test Photo',
    imageUrl: '/test.jpg',
  };

  it('renders photo card with required props', () => {
    render(<PhotoCard {...defaultProps} />);
    
    expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title);
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.imageUrl);
    expect(screen.getByRole('img')).toHaveAttribute('alt', defaultProps.title);
  });

  it('renders description when provided', () => {
    const description = 'A beautiful test photo';
    render(<PhotoCard {...defaultProps} description={description} />);
    
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<PhotoCard {...defaultProps} onView={onView} />);
    
    const button = screen.getByRole('button', { name: `View ${defaultProps.title}` });
    fireEvent.click(button);
    
    expect(onView).toHaveBeenCalledTimes(1);
  });

  it('does not render view button when onView is not provided', () => {
    render(<PhotoCard {...defaultProps} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
}); 