<section class="index-widget-switchproduct">
	<div class="product-list clearfix">

		{%foreach $data.product as $index=>$doc%}
			<a class="product-item ref" target="_blank" href="{%$doc.href%}">
				<div class="product-icon" style="background-position: {%$doc.bgposition%};">
				</div>
				<div class="product-title">{%$doc.title%}</div>
			</a>
		{%/foreach%}
	</div>
</section>