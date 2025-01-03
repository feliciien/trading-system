import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Trading from '../pages/trading';

// Mock the custom hooks
jest.mock('../hooks/useCryptoUsd', () => ({
  __esModule: true,
  default: () => ({ price: 45000, loading: false })
}));

jest.mock('../hooks/useUsdJpy', () => ({
  __esModule: true,
  default: () => ({ price: 154.30, loading: false })
}));

describe('Formula Selection Tests', () => {
  beforeEach(() => {
    render(<Trading />);
  });

  it('should display all formula options in dropdown', () => {
    const formulaOptions = [
      'Any pair/USD',
      'USD/Any pair',
      'USD/JPY specific',
      'JPY/Any pair to USD',
      'Any pair to USD',
      'Indices',
      'Crypto/USD',
      'Crypto/Crypto to USD',
      'Metals/USD'
    ];

    const dropdown = screen.getByRole('combobox', { name: /formula/i });
    fireEvent.click(dropdown);

    formulaOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should update selected formula when option is chosen', async () => {
    const dropdown = screen.getByRole('combobox', { name: /formula/i });
    fireEvent.click(dropdown);
    
    const cryptoOption = screen.getByText('Crypto/USD');
    await userEvent.click(cryptoOption);

    expect(dropdown).toHaveValue('CRYPTO/USD');
  });

  it('should persist formula selection after symbol change', async () => {
    // Select formula first
    const dropdown = screen.getByRole('combobox', { name: /formula/i });
    fireEvent.click(dropdown);
    await userEvent.click(screen.getByText('Crypto/USD'));

    // Change symbol
    const symbolDropdown = screen.getByRole('combobox', { name: /symbol/i });
    fireEvent.click(symbolDropdown);
    await userEvent.click(screen.getByText('BTCUSD'));

    // Verify formula persists
    expect(dropdown).toHaveValue('CRYPTO/USD');
  });

  it('should use correct price source based on formula', async () => {
    // Test CRYPTO/USD formula
    const dropdown = screen.getByRole('combobox', { name: /formula/i });
    fireEvent.click(dropdown);
    await userEvent.click(screen.getByText('Crypto/USD'));

    const price = screen.getByTestId('current-price');
    expect(price).toHaveTextContent('45000');

    // Test USD/JPY formula
    fireEvent.click(dropdown);
    await userEvent.click(screen.getByText('USD/JPY specific'));
    expect(price).toHaveTextContent('154.30');
  });
});