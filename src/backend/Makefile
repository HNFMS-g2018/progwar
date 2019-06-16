CC=gcc
CFLAGS=-Wall -Werror -Wshadow -O2
LD=gcc
LFLAGS=
EXE=pwback

OBJ=main.o

.PHONY: clean

$(EXE): $(OBJ)
	$(LD) $(LFLAGS) $(OBJ) -o pwback

main.o:

clean:
	rm -f $(EXE) $(OBJ)
