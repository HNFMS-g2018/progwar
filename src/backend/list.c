#include "list.h"
#include <stdlib.h>
#include <assert.h>

struct list_node* list_init(struct list_node *cur)
{
	assert(cur);

	cur->prev = cur;
	cur->next = cur;

	return cur;
}

struct list_node* list_node_new(void)
{
	struct list_node *n = (struct list_node*)malloc(sizeof(struct list_node));
	if (!n)
		return NULL;
	return list_init(n);
}

int list_node_delete(struct list_node *d)
{
	/*
	 * XXX 我也不知道这里是 d 好还是 NULL 好。
	 * 不过先用 d 吧。
	 */
	d->prev = NULL;
	d->next = NULL;

	free(d);

	/*
	 * XXX 这里也不知道要返回什么。
	 */
	return 0;
}

int list_insert
(struct list_node *left, struct list_node *mid, struct list_node *right)
{
	assert(left);
	assert(mid);
	assert(right);

	left->next = mid;
	mid->next = right;
	right->prev = mid;
	mid->prev = left;

	/*
	 * XXX
	 * 还是没有想到什么可以 return 1 的地方。
	 * 所以还是让她 return 0 好了。
	 */
	return 0;
}

struct list_node* list_delete(struct list_node *cur)
{
	assert(cur);
	assert(cur->prev);
	assert(cur->next);

	cur->prev->next = cur->next;
	cur->next->prev = cur->prev;

	return cur;
}

int list_empty(struct list_node *cur)
{
	assert(cur);
	assert(cur->prev);
	assert(cur->next);

	return cur->prev == cur->next;
}
