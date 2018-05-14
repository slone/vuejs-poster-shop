const PRICE = 9.99;
const LOAD_NUM = 4;

new Vue({
	el: "#app",
	data: {
		total: 0,
		items: [], 
		cart: [],
		results: [],
		newSearch: "elite dangerous",
		lastSearch: "",
		loadingStatus: false,
	},
	computed: {
		noMoreItems: function() {
			return this.items.length == this.results.length && this.results.length > 0;			
		}
	},
	methods: {
		appendItems: function() {
			if (this.items.length < this.results.length) {
//				console.log("results: ", this.results);
				let append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
				console.log("append: ", append);
				this.items = this.items.concat(append);
//				console.log("items: ", this.items);
			} else {

			}
		},
		onSubmit: function() {
			if (this.newSearch.length == 0) return;
			this.loadingStatus = true;
			this.$http
				.get('/search/'.concat(this.newSearch))
				.then(function(res) {
					this.lastSearch = this.newSearch;
					this.results = res.data;
					this.appendItems();
					this.results.forEach(function(item) {
						let variable = Math.round(Math.random()*4);
							variable = Math.random() > .5 ? -variable : variable;
						item.price = PRICE + variable;
					});
					this.loadingStatus = false;
				});
		},
		addItem: function(index) {
			let item = this.items[index];
			this.total += item.price;
			let found = false;
			for(let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === item.id) {
					this.cart[i].qty++;
					found = true;
					break;
				}
			}

			if (!found) {
				this.cart.push({
					id: item.id,
					title: item.title,
					qty: 1,
					price: item.price
				});
			}
		},
		inc: function(item) {
			item.qty++;
			this.total += item.price;
		},
		dec: function(item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				for (let i=0; i < this.cart.length; i++) {
					if (this.cart[i].id === item.id) {
						this.cart.splice(i, 1);
						break;
					}
				}
			}
		},
	},
	filters: {
		currency: function(price) {
			return "$".concat(price.toFixed(2));
		}
	},
	mounted: function() {
		this.onSubmit();

		var vueInstance = this;
		var elem = document.getElementById('product-list-bottom')
		var watcher = scrollMonitor.create(elem);
		watcher.enterViewport(function() {
			vueInstance.appendItems();
		});

	}
});
