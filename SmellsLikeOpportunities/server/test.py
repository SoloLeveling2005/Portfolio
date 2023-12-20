# import g4f
#
# g4f.debug.logging = True  # Enable logging
# g4f.check_version = False  # Disable automatic version checking
#
# # Automatic selection of provider
#
# # Streamed completion
# response = g4f.ChatCompletion.create(
#     model=g4f.models.gpt_4,
#     messages=[{"role": "user", "content": "Hello"}],
# )
# print(response)
#

from abc import ABC, abstractmethod


class Piece(ABC):
    @abstractmethod
    def move(self):
        pass


class Queen(Piece):
    def move(self):
        print('Ход ферзя')


a = Piece()
b = Queen()
a.move(),
b.move()
