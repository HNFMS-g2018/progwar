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

list.o: list.h

list_test.o:

list.test: list.o list_test.o
	$(CC) $(CFLAGS) $^ -o $@

clean:
	rm -f $(EXE) *.o *.test
