#ifndef LIST_H_
#define LIST_H_

#ifdef __cplusplus
extern "C" {
#endif

	/*
	 * 双向循环列表。
	 * 列表得有一个元素当作表头。这个表头是不能存信息的。
	 * 没有为什么！我说是这样就是这样啦。
	 */
	struct list_node {
		struct list_node *prev;
		struct list_node *next;
	};

	/*
	 * 遍历列表。
	 * i 为循环变量，head 为表头指针，
	 * type 为数据类型。
	 */
#define list_foreach(i, head, type) \
	for ( \
			i = (type *)((struct list_node*)(head))->next; \
			i != (head); \
			i = (type *)((struct list_node*)i)->next \
		)

	/*
	 * 新建一个列表节点。
	 * 返回新节点。
	 */
	struct list_node* list_node_new(void);

	/*
	 * 删除一个列表节点。
	 * 成功返回 0 。否则返回 1 。
	 * 传入空指针就死定了。
	 */
	int list_node_delete(struct list_node *d);

	/*
	 * 初始化一个列表。传入列表的头节点。
	 * 务必记得初始化列表啊！
	 * 传入空指针就死定了。
	 */
	struct list_node* list_init(struct list_node *cur);

	/*
	 * 往列表里加入一个节点。
	 * 成功返回 0 。否则返回非 0 的数（因为返回什么我也没有想好啊）。
	 * 传入空指针就死定了。
	 */
	int list_insert
		(struct list_node *left, struct list_node *mid, struct list_node *right);

	/*
	 * 从列表中删除一个节点。
	 * 返回被删掉的节点（方便 free 掉）。
	 * 传入空指针就死定了。
	 * 传入没有在列表里的节点也死定了。
	 */
	struct list_node* list_delete(struct list_node *cur);

	/*
	 * 判断列表是否为空 。
	 * 是 返回 1 。否 返回 0 。
	 * 传入空指针就死定了。
	 */
	int list_empty(struct list_node *cur);

#ifdef __cplusplus
}
#endif

#endif /* LIST_H_ */
