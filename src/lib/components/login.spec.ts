import {test} from 'vitest'

  test('dummy', () => { });

//   xtest("Should set password", async () => {
//     let pword = '';
//     const handleLogin = (password: string) => { pword = password; };
//     render(Login, { handleLogin });
//     const input = screen.getByLabelText('Password');
//     await fireEvent.input(input, { target: { value: 'abc123' } });
//     await fireEvent.click(screen.getByText('Login'));
//     expect(pword).toBe('abc123');
//   });
// });